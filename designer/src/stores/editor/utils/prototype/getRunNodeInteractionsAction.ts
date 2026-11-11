import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getResolvedInteractions } from '@root/utils/conditions/conditionModel'
import { getHiddenIdsAfterInteractions } from '@root/utils/flows/flowModel'
import { findNode } from '@root/utils/nodes'

export const getRunNodeInteractionsAction =
  (set: EditorStoreSet): EditorActions['runNodeInteractions'] =>
  (nodeId, trigger, sourceInteractions) =>
    set((state) => {
      if (!state.previewMode) {
        return
      }

      const node = findNode(state.nodes, nodeId)

      const rules =
        (sourceInteractions ?? node?.interactions)?.filter((item) => item.trigger === trigger) ?? []

      const { interactions, invalidInputs } = getResolvedInteractions(
        nodeId,
        rules,
        state.prototypeValues,
        state.prototypeExamples,
      )

      state.prototypeConditionError = invalidInputs.length
        ? invalidInputs
            .map(
              (id) =>
                findNode(state.nodes, id)?.label ??
                String(findNode(state.nodes, id)?.props.label ?? id),
            )
            .join(', ')
        : null

      state.prototypeHiddenNodeIds = getHiddenIdsAfterInteractions(
        state.nodes,
        state.prototypeHiddenNodeIds,
        interactions,
      )

      for (const interaction of interactions) {
        if (interaction.action === 'openOverlay') {
          state.prototypeOverlayTriggerIds[interaction.targetNodeId] = nodeId
        }
      }
    })
