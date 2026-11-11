import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

export const getToggleFields = (nodes: DesignNode[], registry: Registry) =>
  getConditionNodes(nodes).filter(
    (node) => typeof registry[node.type]?.previewValue?.emptyValue === 'boolean',
  )
