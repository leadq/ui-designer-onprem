import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getSetPrototypeHiddenAction =
  (set: EditorStoreSet): EditorActions['setPrototypeHidden'] =>
  (nodeId, hidden) =>
    set((state) => {
      const node = findNode(state.nodes, nodeId)

      if (!node) {
        return
      }

      node.prototypeHidden = hidden || undefined

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
