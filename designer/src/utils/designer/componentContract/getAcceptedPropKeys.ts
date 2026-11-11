import type { ComponentMeta } from '@root/types/componentContract'

export const getAcceptedPropKeys = (meta: ComponentMeta): string[] => [
  ...new Set([
    ...Object.keys(meta.defaultProps),
    ...meta.propsSchema.filter((prop) => prop.type !== 'dataTable').map((prop) => prop.key),
  ]),
]
