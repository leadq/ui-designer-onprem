import { useCallback, useEffect, useState } from 'react'
import { useEditorStore } from '@root/stores/editor'
import type { DesignInteractionTrigger } from '@root/types/flow'
import type { DesignCondition, InteractionOutcome } from '@root/types/preview'
import { findNode } from '@root/utils/nodes'

import { getInitialInteractionOutcome } from '../utils/getInitialInteractionOutcome'

const INITIAL_OUTCOME: InteractionOutcome = { action: 'goTo', targetNodeId: '' }

/** Draft edits invalidate the save status at the event boundary, without a reset effect. */
export const useInteractionDraft = (
  nodeId: string,
  initialRuleId: string | undefined,
  isOpen: boolean,
) => {
  const [trigger, setTrigger] = useState<DesignInteractionTrigger>('click')
  const [outcome, setOutcome] = useState<InteractionOutcome>(INITIAL_OUTCOME)
  const [condition, setCondition] = useState<DesignCondition | undefined>()
  const [otherwise, setOtherwise] = useState<InteractionOutcome | undefined>()
  const [isSaved, setIsSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    // Read the current document once per editing session; store changes must not erase a draft.
    const currentNodes = useEditorStore.getState().nodes
    const currentNode = findNode(currentNodes, nodeId)

    setIsSaved(false)

    setTrigger('click')

    setEditingId(null)

    setCondition(undefined)

    setOtherwise(undefined)

    setError(false)

    const existing = currentNode?.interactions?.find((rule) => rule.id === initialRuleId)

    setIsFormOpen(Boolean(existing))

    if (existing) {
      setEditingId(existing.id)

      setTrigger(existing.trigger)

      setOutcome({
        action: existing.action,
        targetNodeId: existing.targetNodeId,
        intent: existing.intent,
      })

      setCondition(existing.condition)

      setOtherwise(existing.otherwise)

      return
    }

    setOutcome(getInitialInteractionOutcome(currentNodes, nodeId))
  }, [nodeId, initialRuleId, isOpen])

  const handleTriggerChange = useCallback((value: DesignInteractionTrigger) => {
    setTrigger(value)

    setIsSaved(false)
  }, [])

  const handleOutcomeChange = useCallback((value: InteractionOutcome) => {
    setOutcome(value)

    setIsSaved(false)
  }, [])

  const handleConditionChange = useCallback((value: DesignCondition | undefined) => {
    setCondition(value)

    setIsSaved(false)
  }, [])

  const handleOtherwiseChange = useCallback((value: InteractionOutcome | undefined) => {
    setOtherwise(value)

    setIsSaved(false)
  }, [])

  return {
    trigger,
    setTrigger: handleTriggerChange,
    outcome,
    setOutcome: handleOutcomeChange,
    condition,
    setCondition: handleConditionChange,
    otherwise,
    setOtherwise: handleOtherwiseChange,
    isSaved,
    setIsSaved,
    editingId,
    setEditingId,
    error,
    setError,
    isFormOpen,
    setIsFormOpen,
  }
}
