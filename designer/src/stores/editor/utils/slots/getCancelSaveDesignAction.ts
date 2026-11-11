import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getCancelSaveDesignAction =
  (set: EditorStoreSet): EditorActions['cancelSaveDesign'] =>
  () =>
    set((state) => {
      state.saveDesignNodeIds = []
    })
