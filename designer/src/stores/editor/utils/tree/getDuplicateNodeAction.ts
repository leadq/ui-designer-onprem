import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { getFrameIds } from '@root/utils/frames/frameWorkspace'
import { cloneNodeWithNewIds, findNode, findParent } from '@root/utils/nodes'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getDuplicateNodeAction =
  (set: EditorStoreSet): EditorActions['duplicateNode'] =>
  (id) =>
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

      const newNode = cloneNodeWithNewIds(node)
      const parent = findParent(state.nodes, id)
      const siblingArray = parent ? parent.children : state.nodes
      const index = siblingArray.findIndex((node) => node.id === id)

      siblingArray.splice(index + 1, 0, newNode)

      state.selectedFrameIds = []

      state.selectedNodeIds = [newNode.id]

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
