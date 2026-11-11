import type { ComponentStateRule, PreviewValue } from '@root/types/preview'

import { evaluateCondition } from '../conditionModel'

export const isStateRuleMatched = (
  rule: ComponentStateRule,
  values: Record<string, PreviewValue>,
): boolean => {
  if (!rule.conditions.length) {
    return false
  }

  const results = rule.conditions.map((condition) =>
    evaluateCondition(condition, values[condition.source.nodeId]),
  )

  // A missing/invalid input never enables a control or reveals content.
  if (results.includes(null)) {
    return false
  }

  return rule.match === 'all' ? results.every(Boolean) : results.some(Boolean)
}
