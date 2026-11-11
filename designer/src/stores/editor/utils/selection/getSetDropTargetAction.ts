import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getSetDropTargetAction =
  (set: EditorStoreSet): EditorActions['setDropTarget'] =>
  (target) =>
    set((state) => {
      state.dropTarget = target
    })
