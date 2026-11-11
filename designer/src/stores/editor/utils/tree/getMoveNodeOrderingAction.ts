import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { findParent } from '@root/utils/nodes'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getMoveNodeOrderingAction =
  (set: EditorStoreSet): EditorActions['moveNodeOrdering'] =>
  (id, direction) =>
    set((state) => {
      if (isTableCell(state.nodes, id) || isCollectionItem(state.nodes, id)) {
        return
      }

      const parent = findParent(state.nodes, id)
      let siblingArray = parent ? parent.children : state.nodes

      // If the node is in a slot of parent, siblingArray is the slot array
      if (parent && parent.slots) {
        for (const slotNodes of Object.values(parent.slots)) {
          if (slotNodes.some((node) => node.id === id)) {
            siblingArray = slotNodes

            break
          }
        }
      }

      const index = siblingArray.findIndex((node) => node.id === id)

      if (index === -1) {
        return
      }

      if (direction === 'up' && index === 0) {
        return
      }

      if (direction === 'down' && index === siblingArray.length - 1) {
        return
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1
      // Swap
      const temp = siblingArray[index]

      siblingArray[index] = siblingArray[targetIndex]

      siblingArray[targetIndex] = temp

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
