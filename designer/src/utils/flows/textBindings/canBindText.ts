import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

export const canBindText = (node: DesignNode, registry: Registry): boolean =>
  !registry[node.type]?.isContainer &&
  Boolean(
    registry[node.type]?.propsSchema.some(
      (prop) => prop.key === 'children' && prop.type === 'text',
    ),
  )
