import { getAdapter } from '@root/adapters'
import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { getFrameIds } from '@root/utils/frames/frameWorkspace'
import { createNode, findNode, findParent } from '@root/utils/nodes'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getWrapInContainerAction =
  (set: EditorStoreSet): EditorActions['wrapInContainer'] =>
  (id, containerType) =>
    set((state) => {
      if (isTableCell(state.nodes, id) || isCollectionItem(state.nodes, id)) {
        return
      }

      if (getFrameIds(state.nodes).has(id) || findNode(state.nodes, id)?.flow) {
        return
      }

      const node = findNode(state.nodes, id)

      if (!node) {
        return
      }

      const parent = findParent(state.nodes, id)
      const siblingArray = parent ? parent.children : state.nodes
      const index = siblingArray.findIndex((node) => node.id === id)

      const containerNode = createNode(
        registry,
        containerType ?? getAdapter(state.adapterId).defaultContainerType,
      )

      containerNode.children.push(node)

      siblingArray.splice(index, 1, containerNode)

      state.selectedFrameIds = []

      state.selectedNodeIds = [containerNode.id]

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
