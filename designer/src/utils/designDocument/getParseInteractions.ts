import type {
  DesignInteractionAction,
  DesignInteractionTrigger,
  DesignTransitionIntent,
} from '@root/types/flow'
import type { DesignInteraction } from '@root/types/preview'
import { getParsedCondition } from '@root/utils/conditions/getParsedCondition'

import { INTERACTION_ACTIONS, INTERACTION_TRIGGERS } from './constants'
import { isRecord } from './isRecord'

export const getParseInteractions = (value: unknown): DesignInteraction[] => {
  if (value === undefined) {
    return []
  }

  if (!Array.isArray(value)) {
    throw new Error('Invalid interaction list')
  }

  return value.map((item) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.targetNodeId !== 'string') {
      throw new Error('Invalid interaction identifiers')
    }

    if (!INTERACTION_TRIGGERS.has(item.trigger as DesignInteractionTrigger)) {
      throw new Error('Invalid interaction trigger')
    }

    if (!INTERACTION_ACTIONS.has(item.action as DesignInteractionAction)) {
      throw new Error('Invalid interaction action')
    }

    if (
      item.intent !== undefined &&
      (!['formStep', 'navigation', 'stateChange'].includes(String(item.intent)) ||
        item.action !== 'goTo')
    ) {
      throw new Error('Invalid connection intent')
    }

    if (item.otherwise !== undefined && (!item.condition || !isRecord(item.otherwise))) {
      throw new Error('Otherwise requires a condition and outcome')
    }

    if (
      isRecord(item.otherwise) &&
      (item.otherwise.condition !== undefined || item.otherwise.otherwise !== undefined)
    ) {
      throw new Error('Nested conditions are unsupported')
    }

    const otherwise = isRecord(item.otherwise)
      ? getParseInteractions([{ ...item.otherwise, id: item.id, trigger: item.trigger }])[0]
      : undefined

    return {
      id: item.id,
      trigger: item.trigger as DesignInteractionTrigger,
      action: item.action as DesignInteractionAction,
      targetNodeId: item.targetNodeId,
      ...(item.intent ? { intent: item.intent as DesignTransitionIntent } : {}),
      ...(item.condition !== undefined ? { condition: getParsedCondition(item.condition) } : {}),
      ...(otherwise
        ? {
            otherwise: {
              action: otherwise.action,
              targetNodeId: otherwise.targetNodeId,
              ...(otherwise.intent ? { intent: otherwise.intent } : {}),
            },
          }
        : {}),
    }
  })
}
