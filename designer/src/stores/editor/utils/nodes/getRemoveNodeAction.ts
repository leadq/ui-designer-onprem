import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { findNode, findParent } from '@root/utils/nodes'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getRemoveNodeAction =
  (set: EditorStoreSet): EditorActions['removeNode'] =>
  (id) =>
    set((state) => {
      if (isCollectionItem(state.nodes, id)) {
        return
      }

      if (isTableCell(state.nodes, id)) {
        const cell = findNode(state.nodes, id)

        if (cell) {
          cell.children = []

          cell.slots = undefined
        }

        const history = getNextHistory(state)

        state.history = history.history

        state.historyIndex = history.historyIndex

        return
      }

      const ownedFrames =
        findNode(state.nodes, id)?.flow?.screens.map((screen) => screen.nodeId) ?? []

      if (ownedFrames.length) {
        state.nodes = state.nodes.filter((node) => !ownedFrames.includes(node.id))
      }

      const parent = findParent(state.nodes, id)

      if (parent) {
        parent.children = parent.children.filter((child) => child.id !== id)

        if (parent.slots) {
          for (const [key, slotNodes] of Object.entries(parent.slots)) {
            parent.slots[key] = slotNodes.filter((child) => child.id !== id)

            if (parent.slots[key].length === 0) {
              delete parent.slots[key]
            }
          }

          if (Object.keys(parent.slots).length === 0) {
            delete parent.slots
          }
        }
      } else {
        state.nodes = state.nodes.filter((node) => node.id !== id)
      }

      state.selectedFrameIds = []

      state.selectedNodeIds = state.selectedNodeIds.filter((selectedId) => selectedId !== id)

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
