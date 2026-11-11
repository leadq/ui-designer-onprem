import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

export const canDisableNode = (node: DesignNode, registry: Registry): boolean =>
  Boolean(
    registry[node.type]?.propsSchema.some(
      (prop) => prop.key === 'disabled' && prop.type === 'boolean',
    ),
  )
