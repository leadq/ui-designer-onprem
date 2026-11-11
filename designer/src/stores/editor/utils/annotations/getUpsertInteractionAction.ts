import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getUpsertInteractionAction =
  (set: EditorStoreSet): EditorActions['upsertInteraction'] =>
  (nodeId, interaction) =>
    set((state) => {
      const node = findNode(state.nodes, nodeId)

      if (!node) {
        return
      }

      const interactions = [...(node.interactions ?? [])]
      const existingIndex = interactions.findIndex((item) => item.id === interaction.id)

      if (existingIndex >= 0) {
        interactions[existingIndex] = interaction
      } else {
        interactions.push(interaction)
      }

      node.interactions = interactions

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
