import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getClearSelectionAction =
  (set: EditorStoreSet): EditorActions['clearSelection'] =>
  () =>
    set((state) => {
      state.selectedFrameIds = []

      state.selectedNodeIds = []

      state.selectedTableColumnKey = null
    })
