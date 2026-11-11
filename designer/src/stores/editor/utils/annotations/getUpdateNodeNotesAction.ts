import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getUpdateNodeNotesAction =
  (set: EditorStoreSet): EditorActions['updateNodeNotes'] =>
  (id, notes) =>
    set((state) => {
      const node = findNode(state.nodes, id)

      if (node) {
        node.notes = notes || undefined

        const historyUpdate = getNextHistory(state)

        state.history = historyUpdate.history

        state.historyIndex = historyUpdate.historyIndex
      }
    })
