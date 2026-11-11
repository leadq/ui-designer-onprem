import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getRemoveInteractionAction =
  (set: EditorStoreSet): EditorActions['removeInteraction'] =>
  (nodeId, interactionId) =>
    set((state) => {
      const node = findNode(state.nodes, nodeId)

      if (!node) {
        return
      }

      node.interactions = node.interactions?.filter((item) => item.id !== interactionId)

      if (node.interactions?.length === 0) {
        delete node.interactions
      }

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
