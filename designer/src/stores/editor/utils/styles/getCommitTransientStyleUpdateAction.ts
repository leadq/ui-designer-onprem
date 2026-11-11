import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

import { getNextHistory } from '../getNextHistory'

export const getCommitTransientStyleUpdateAction =
  (set: EditorStoreSet): EditorActions['commitTransientStyleUpdate'] =>
  () =>
    set((state) => {
      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
