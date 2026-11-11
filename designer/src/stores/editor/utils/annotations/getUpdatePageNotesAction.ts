import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getUpdatePageNotesAction =
  (set: EditorStoreSet): EditorActions['updatePageNotes'] =>
  (notes) =>
    set((state) => {
      state.pageNotes = notes
    })
