import type { DesignNode } from '@root/types/document'

import { getParsedCondition } from '../getParsedCondition'

export const parseStateRules = (value: unknown): NonNullable<DesignNode['stateRules']> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid component state rules')
  }

  const result: NonNullable<DesignNode['stateRules']> = {}

  for (const [key, entry] of Object.entries(value)) {
    if (!['visibleWhen', 'enabledWhen'].includes(key) || !entry || typeof entry !== 'object') {
      throw new Error('Invalid component state rule')
    }

    const rule = entry as Record<string, unknown>

    if (
      !['all', 'any'].includes(String(rule.match)) ||
      !Array.isArray(rule.conditions) ||
      !rule.conditions.length
    ) {
      throw new Error('A state rule requires conditions')
    }

    const conditions = rule.conditions.map((item) => {
      const condition = getParsedCondition(item)

      if (condition.source.kind !== 'field') {
        throw new Error('Component state requires a field value')
      }

      return { ...condition, source: condition.source }
    })

    result[key as keyof typeof result] = { match: rule.match as 'all' | 'any', conditions }
  }

  return result
}
