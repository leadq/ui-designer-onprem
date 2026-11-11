import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getRedoAction =
  (set: EditorStoreSet): EditorActions['redo'] =>
  () =>
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1

        state.nodes = JSON.parse(JSON.stringify(state.history[state.historyIndex]))
      }
    })
