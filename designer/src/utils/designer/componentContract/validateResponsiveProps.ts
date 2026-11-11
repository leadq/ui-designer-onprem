import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import type { ComponentMeta } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const validateResponsiveProps = (node: DesignNode, meta?: ComponentMeta): void => {
  if (node.responsiveProps === undefined) {
    return
  }

  if (!meta || !isRecord(node.responsiveProps)) {
    throw new Error(`${node.id}: invalid responsiveProps`)
  }

  for (const [breakpoint, props] of Object.entries(node.responsiveProps)) {
    if (breakpoint === 'xl' || !Object.hasOwn(BREAKPOINT_MAP, breakpoint) || !isRecord(props)) {
      throw new Error(`${node.id}.responsiveProps.${breakpoint}: invalid breakpoint/props`)
    }

    for (const [key, value] of Object.entries(props)) {
      const schema = meta.propsSchema.find((item) => item.key === key && item.isResponsive)

      if (!schema) {
        throw new Error(`${node.id}.responsiveProps.${breakpoint}.${key}: not a responsive prop`)
      }

      const isValid =
        schema.type === 'boolean'
          ? typeof value === 'boolean'
          : schema.type === 'number'
            ? typeof value === 'number' && Number.isFinite(value)
            : schema.type === 'select'
              ? typeof value === 'string' && schema.options?.includes(value)
              : ['text', 'color'].includes(schema.type) && typeof value === 'string'

      if (!isValid || (typeof value === 'string' && /^\{?item\./.test(value))) {
        throw new Error(`${node.id}.responsiveProps.${breakpoint}.${key}: invalid scalar option`)
      }
    }
  }
}
