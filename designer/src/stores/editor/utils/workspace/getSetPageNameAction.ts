import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getSetPageNameAction =
  (set: EditorStoreSet): EditorActions['setPageName'] =>
  (name) =>
    set((state) => {
      state.pageName = name
    })
