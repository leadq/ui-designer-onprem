import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getToggleVisibility, getValuesAfterToggle } from '@root/utils/conditions/toggleBindings'

export const getSetPrototypeValueAction =
  (set: EditorStoreSet): EditorActions['setPrototypeValue'] =>
  (nodeId, value) =>
    set((state) => {
      if (state.previewMode) {
        state.prototypeValues = getValuesAfterToggle(
          state.nodes,
          state.prototypeValues,
          nodeId,
          value,
        )

        state.prototypeFieldVisibility = getToggleVisibility(state.nodes, state.prototypeValues)

        state.prototypeConditionError = null
      }
    })
