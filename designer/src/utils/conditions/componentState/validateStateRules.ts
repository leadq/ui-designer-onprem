import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

import { canDisableNode } from './canDisableNode'
import { getStateFields } from './getStateFields'

export const validateStateRules = (nodes: DesignNode[], registry: Registry): void => {
  const all = getConditionNodes(nodes)

  const visit = (items: DesignNode[]) =>
    items.forEach((node) => {
      if (node.stateRules) {
        if (!all.includes(node) || node.flow || node.overlay || node.type === 'designerFrame') {
          throw new Error('State rules require a unique component')
        }

        if (node.stateRules.enabledWhen && !canDisableNode(node, registry)) {
          throw new Error('This component does not support disabled state')
        }

        const fields = new Set(getStateFields(nodes, [node], registry).map((field) => field.id))

        for (const rule of Object.values(node.stateRules)) {
          if (rule.conditions.some((condition) => !fields.has(condition.source.nodeId))) {
            throw new Error('State rule references an unavailable or descendant field')
          }
        }
      }

      visit(node.children)

      Object.values(node.slots ?? {}).forEach(visit)
    })

  visit(nodes)
}
