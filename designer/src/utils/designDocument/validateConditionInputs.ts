import { getAdapter } from '@root/adapters'
import type { DesignNode } from '@root/types/document'
import { validateStateRules } from '@root/utils/conditions/componentState'
import { getConditionNodes } from '@root/utils/conditions/conditionModel'
import { validateToggleBindings } from '@root/utils/conditions/toggleBindings'
import { validateComponentContract } from '@root/utils/designer/componentContract'
import { validateTextBindings } from '@root/utils/flows/textBindings'

export const validateConditionInputs = (nodes: DesignNode[], adapterId: string): void => {
  const registry = getAdapter(adapterId).registry

  validateComponentContract(nodes, registry)

  validateToggleBindings(nodes, registry)

  validateTextBindings(nodes, registry)

  validateStateRules(nodes, registry)

  const inputs = getConditionNodes(nodes)

  for (const node of inputs) {
    for (const rule of node.interactions ?? []) {
      const source = rule.condition?.source

      if (source?.kind !== 'field') {
        continue
      }

      const input = inputs.find((candidate) => candidate.id === source.nodeId)

      if (!input || !registry[input.type]?.previewValue) {
        throw new Error('Condition requires an adapter-supported input field')
      }
    }
  }
}
