import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'

export const getSetPrototypeExampleAction =
  (set: EditorStoreSet): EditorActions['setPrototypeExample'] =>
  (key, value) =>
    set((state) => {
      if (state.previewMode) {
        state.prototypeExamples[key] = value
      }
    })
