import type { DesignInteraction, InteractionOutcome, PreviewValue } from '@root/types/preview'

import { getExampleKey } from './getExampleKey'
import { isConditionMatched } from './isConditionMatched'

export const getResolvedInteractions = (
  nodeId: string,
  rules: DesignInteraction[],
  values: Record<string, PreviewValue>,
  examples: Record<string, string>,
) => {
  const invalidInputs: string[] = []

  const interactions = rules.flatMap((rule) => {
    if (!rule.condition) {
      return [rule]
    }

    const source = rule.condition.source

    const value =
      source.kind === 'field'
        ? values[source.nodeId]
        : (examples[getExampleKey(nodeId, rule.id)] ?? source.defaultValue)

    const matches = isConditionMatched(rule.condition, value)

    if (matches === null) {
      invalidInputs.push(source.kind === 'field' ? source.nodeId : source.label)

      return []
    }

    const outcome: InteractionOutcome | undefined = matches ? rule : rule.otherwise

    return outcome
      ? [
          {
            id: rule.id,
            trigger: rule.trigger,
            action: outcome.action,
            targetNodeId: outcome.targetNodeId,
            intent: outcome.intent,
          },
        ]
      : []
  })

  return { interactions, invalidInputs }
}
