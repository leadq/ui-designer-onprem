import type { DesignNode } from '@root/types/document'
import type { ComponentStateRule } from '@root/types/preview'

import { getConditionNodes } from '../conditionModel'
import { getToggleTargetIds, getToggleVisibleWhen } from '../toggleBindings'

/** Target-owned rules take precedence; old switch documents are read without rewriting them. */
export const getVisibilityRule = (
  nodes: DesignNode[],
  target: DesignNode,
): ComponentStateRule | undefined => {
  if (target.stateRules?.visibleWhen) {
    return target.stateRules.visibleWhen
  }

  const source = getConditionNodes(nodes).find((node) =>
    getToggleTargetIds(node.toggleBinding).includes(target.id),
  )

  return source
    ? {
        match: 'all',
        conditions: [
          {
            source: { kind: 'field', nodeId: source.id },
            operator: 'equals',
            value: getToggleVisibleWhen(source.toggleBinding, target.id),
          },
        ],
      }
    : undefined
}
