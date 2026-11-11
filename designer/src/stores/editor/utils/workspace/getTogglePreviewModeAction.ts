import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getExamples, getInitialValues } from '@root/utils/conditions/conditionModel'
import { getInitialToggleValues, getToggleVisibility } from '@root/utils/conditions/toggleBindings'
import { getInitialHiddenIds } from '@root/utils/flows/flowModel'
import { getFrameInsertionTarget } from '@root/utils/frames/frameWorkspace'

export const getTogglePreviewModeAction =
  (set: EditorStoreSet): EditorActions['togglePreviewMode'] =>
  () =>
    set((state) => {
      state.previewMode = !state.previewMode

      state.prototypeOverlayTriggerIds = {}

      state.prototypeConditionError = null

      state.prototypeValues = getInitialToggleValues(
        state.nodes,
        getInitialValues(state.nodes, registry),
      )

      state.prototypeFieldVisibility = getToggleVisibility(state.nodes, state.prototypeValues)

      state.prototypeExamples = Object.fromEntries(
        getExamples(state.nodes).map((example) => [example.key, example.defaultValue]),
      )

      if (state.previewMode) {
        state.selectedFrameIds = []

        state.selectedNodeIds = [] // clear selection on preview

        state.focusedContainerId = null // clear focused container on preview

        state.prototypeHiddenNodeIds = [
          ...getInitialHiddenIds(state.nodes),
          ...state.slotComponents.flatMap((component) => getInitialHiddenIds(component.nodes)),
        ]
      } else {
        state.focusedContainerId =
          getFrameInsertionTarget(state.nodes, state.editingFlowScreenId) ?? null

        state.prototypeHiddenNodeIds = []
      }
    })
