import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getUndoAction =
  (set: EditorStoreSet): EditorActions['undo'] =>
  () =>
    set((state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1

        state.nodes = JSON.parse(JSON.stringify(state.history[state.historyIndex]))
      }
    })
