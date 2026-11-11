import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { getFrameIds, hasRootFrames } from '@root/utils/frames/frameWorkspace'
import { findNode, findParent } from '@root/utils/nodes'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getUnwrapContainerAction =
  (set: EditorStoreSet): EditorActions['unwrapContainer'] =>
  (id) =>
    set((state) => {
      if (isTableCell(state.nodes, id) || isCollectionItem(state.nodes, id)) {
        return
      }

      const node = findNode(state.nodes, id)

      if (
        !node ||
        node.children.length === 0 ||
        (hasRootFrames(state.nodes) && getFrameIds(state.nodes).has(id))
      ) {
        return
      }

      const parent = findParent(state.nodes, id)

      const siblingArray = parent
        ? [parent.children, ...Object.values(parent.slots ?? {})].find((siblings) =>
            siblings.some((sibling) => sibling.id === id),
          )
        : state.nodes

      if (!siblingArray) {
        return
      }

      const index = siblingArray.findIndex((node) => node.id === id)

      siblingArray.splice(index, 1, ...node.children)

      state.selectedFrameIds = []

      state.selectedNodeIds = [node.children[0].id]

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
