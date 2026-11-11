import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getDeleteSlotComponentAction =
  (set: EditorStoreSet): EditorActions['deleteSlotComponent'] =>
  (id) =>
    set((state) => {
      state.slotComponents = state.slotComponents.filter((child) => child.id !== id)
    })
