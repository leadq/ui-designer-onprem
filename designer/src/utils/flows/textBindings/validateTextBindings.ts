import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { canBindText } from './canBindText'
import { getTextFields } from './getTextFields'

export const validateTextBindings = (nodes: DesignNode[], registry: Registry): void => {
  const fields = getTextFields(nodes, registry)

  const visit = (items: DesignNode[], isRepeated = false) => {
    for (const node of items) {
      if (
        node.textBinding &&
        (isRepeated ||
          !canBindText(node, registry) ||
          !fields.some((field) => field.id === node.textBinding?.sourceNodeId))
      ) {
        throw new Error('Text binding requires a supported field and a unique text component')
      }

      visit(node.children, isRepeated)

      Object.values(node.slots ?? {}).forEach((children) => {
        visit(children, true)
      })
    }
  }

  visit(nodes)
}
