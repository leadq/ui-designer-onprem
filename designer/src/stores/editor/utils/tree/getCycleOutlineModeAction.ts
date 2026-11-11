import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getCycleOutlineModeAction =
  (set: EditorStoreSet): EditorActions['cycleOutlineMode'] =>
  () =>
    set((state) => {
      state.outlineMode =
        state.outlineMode === 'selection'
          ? 'layout'
          : state.outlineMode === 'layout'
            ? 'parent'
            : 'selection'
    })
