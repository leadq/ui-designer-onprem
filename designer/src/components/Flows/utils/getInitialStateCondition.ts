import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import type { ComponentStateRule } from '@root/types/preview'

export const getInitialStateCondition = (
  field: DesignNode,
): ComponentStateRule['conditions'][number] => ({
  source: { kind: 'field', nodeId: field.id },
  ...(typeof registry[field.type]?.previewValue?.emptyValue === 'boolean'
    ? { operator: 'equals', value: true }
    : { operator: 'notEmpty' }),
})
