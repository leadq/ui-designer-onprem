import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getSetInteractionStateAction =
  (set: EditorStoreSet): EditorActions['setInteractionState'] =>
  (interactionState) =>
    set((state) => {
      state.interactionState = interactionState
    })
