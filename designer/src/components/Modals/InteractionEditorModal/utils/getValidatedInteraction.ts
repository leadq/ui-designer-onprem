import type { DesignNode } from '@root/types/document'
import type { DesignInteractionTrigger } from '@root/types/flow'
import type { DesignCondition, DesignInteraction, InteractionOutcome } from '@root/types/preview'
import { getParsedCondition } from '@root/utils/conditions/getParsedCondition'
import { getOutcomeTargets } from '@root/utils/flows/getOutcomeTargets'
import { findNode } from '@root/utils/nodes'
import { v4 as uuidv4 } from 'uuid'

interface InteractionDraftInput {
  nodes: DesignNode[]
  nodeId: string
  node: DesignNode | null
  trigger: DesignInteractionTrigger
  outcome: InteractionOutcome
  condition: DesignCondition | undefined
  otherwise: InteractionOutcome | undefined
  editingId: string | null
}

export const getValidatedInteraction = ({
  nodes,
  nodeId,
  node,
  trigger,
  outcome,
  condition,
  otherwise,
  editingId,
}: InteractionDraftInput): DesignInteraction => {
  if (condition) {
    getParsedCondition(condition)
  }

  if (condition?.source.kind === 'field' && !findNode(nodes, condition.source.nodeId)) {
    throw new Error('Missing field')
  }

  if (
    otherwise &&
    !getOutcomeTargets(nodes, nodeId, otherwise.action).some(
      (target) => target.value === otherwise.targetNodeId,
    )
  ) {
    throw new Error('Missing else target')
  }

  const draft = {
    trigger,
    ...outcome,
    ...(condition ? { condition, ...(otherwise ? { otherwise } : {}) } : {}),
  }

  const existing = node?.interactions?.find(
    (rule) =>
      rule.trigger === trigger &&
      rule.action === outcome.action &&
      rule.targetNodeId === outcome.targetNodeId &&
      rule.intent === outcome.intent &&
      JSON.stringify(rule.condition) === JSON.stringify(draft.condition) &&
      JSON.stringify(rule.otherwise) === JSON.stringify(draft.otherwise),
  )

  return { id: editingId ?? existing?.id ?? uuidv4(), ...draft }
}
