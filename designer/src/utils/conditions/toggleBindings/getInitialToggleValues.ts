import type { DesignNode } from '@root/types/document'
import type { PreviewValue } from '@root/types/preview'

import { getConditionNodes } from '../conditionModel'

import { getValuesAfterToggle } from './getValuesAfterToggle'

export const getInitialToggleValues = (
  nodes: DesignNode[],
  values: Record<string, PreviewValue>,
): Record<string, PreviewValue> => {
  let next = { ...values }

  for (const node of getConditionNodes(nodes)) {
    if (next[node.id] === true) {
      next = getValuesAfterToggle(nodes, next, node.id, true)
    }
  }

  return next
}
