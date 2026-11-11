import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getUpdateNodeLabelAction =
  (set: EditorStoreSet): EditorActions['updateNodeLabel'] =>
  (id, label) =>
    set((state) => {
      const node = findNode(state.nodes, id)

      if (node) {
        node.label = label

        const historyUpdate = getNextHistory(state)

        state.history = historyUpdate.history

        state.historyIndex = historyUpdate.historyIndex
      }
    })
