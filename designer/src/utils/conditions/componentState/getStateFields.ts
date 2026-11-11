import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

export const getStateFields = (nodes: DesignNode[], targets: DesignNode[], registry: Registry) => {
  const descendants = new Set(getConditionNodes(targets).map((node) => node.id))

  return getConditionNodes(nodes).filter(
    (node) => registry[node.type]?.previewValue && !descendants.has(node.id),
  )
}
