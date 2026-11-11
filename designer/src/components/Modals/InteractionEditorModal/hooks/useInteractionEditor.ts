import { useEditorStore } from '@root/stores/editor'
import type { DesignInteraction } from '@root/types/preview'
import { getOutcomeTargets } from '@root/utils/flows/getOutcomeTargets'
import { getNodeOptions } from '@root/utils/getNodeOptions'
import { findNode } from '@root/utils/nodes'

import { getInitialInteractionOutcome } from '../utils/getInitialInteractionOutcome'
import { getValidatedInteraction } from '../utils/getValidatedInteraction'

import { useInteractionDraft } from './useInteractionDraft'

export const useInteractionEditor = (
  nodeId: string,
  initialRuleId: string | undefined,
  isOpen: boolean,
) => {
  const nodes = useEditorStore((state) => state.nodes)
  const upsertInteraction = useEditorStore((state) => state.upsertInteraction)
  const removeInteraction = useEditorStore((state) => state.removeInteraction)
  const node = findNode(nodes, nodeId)
  const allTargets = getNodeOptions(nodes)

  const {
    trigger,
    setTrigger,
    outcome,
    setOutcome,
    condition,
    setCondition,
    otherwise,
    setOtherwise,
    isSaved,
    setIsSaved,
    editingId,
    setEditingId,
    error,
    setError,
    isFormOpen,
    setIsFormOpen,
  } = useInteractionDraft(nodeId, initialRuleId, isOpen)

  const targets = getOutcomeTargets(nodes, nodeId, outcome.action)

  const handleAdd = () => {
    if (!targets.some((target) => target.value === outcome.targetNodeId)) {
      return
    }

    try {
      const interaction = getValidatedInteraction({
        nodes,
        nodeId,
        node,
        trigger,
        outcome,
        condition,
        otherwise,
        editingId,
      })

      upsertInteraction(nodeId, interaction)

      setEditingId(null)

      setError(false)

      setIsSaved(true)

      setIsFormOpen(false)
    } catch {
      setError(true)
    }
  }

  const handleNew = () => {
    setOutcome(getInitialInteractionOutcome(nodes, nodeId))

    setTrigger('click')

    setCondition(undefined)

    setOtherwise(undefined)

    setEditingId(null)

    setError(false)

    setIsSaved(false)

    setIsFormOpen(true)
  }

  const handleNewClick = handleNew
  const handleSetConditionChange = setCondition
  const handleSetOutcomeChange = setOutcome
  const handleSetOtherwiseChange = setOtherwise
  const handleAddClick = handleAdd

  const handleRuleEdit = (interaction: DesignInteraction) => {
    setIsFormOpen(true)

    setIsSaved(false)

    setEditingId(interaction.id)

    setTrigger(interaction.trigger)

    setOutcome({
      action: interaction.action,
      targetNodeId: interaction.targetNodeId,
      intent: interaction.intent,
    })

    setCondition(interaction.condition)

    setOtherwise(interaction.otherwise)

    setError(false)
  }

  const handleRuleRemove = (interactionId: string) => {
    removeInteraction(nodeId, interactionId)

    if (editingId === interactionId) {
      setEditingId(null)

      setIsFormOpen(false)
    }
  }

  return {
    handleRuleEdit,
    handleRuleRemove,
    nodes,
    removeInteraction,
    node,
    allTargets,
    trigger,
    setTrigger,
    outcome,
    setOutcome,
    condition,
    setCondition,
    otherwise,
    setOtherwise,
    editingId,
    setEditingId,
    error,
    setError,
    isFormOpen,
    setIsFormOpen,
    isSaved,
    setIsSaved,
    targets,
    handleNewClick,
    handleSetConditionChange,
    handleSetOutcomeChange,
    handleSetOtherwiseChange,
    handleAddClick,
  }
}
