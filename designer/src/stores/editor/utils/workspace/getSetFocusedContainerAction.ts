import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getSetFocusedContainerAction =
  (set: EditorStoreSet): EditorActions['setFocusedContainer'] =>
  (id) =>
    set((state) => {
      state.focusedContainerId = id
    })
