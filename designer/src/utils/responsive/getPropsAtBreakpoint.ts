import type { BreakpointKey } from '@root/constants/breakpoints'
import type { ComponentMeta } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

const COMPACT_BREAKPOINTS = ['wide', 'lg', 'md', 'sm', 'xs'] as const

export const getPropsAtBreakpoint = (
  node: DesignNode,
  breakpoint: BreakpointKey,
  meta?: ComponentMeta,
): Record<string, unknown> => {
  const base = { ...meta?.defaultProps, ...node.props }
  const result = { ...base }

  if (breakpoint !== 'xl') {
    for (const key of COMPACT_BREAKPOINTS) {
      Object.assign(result, node.responsiveProps?.[key])

      if (key === breakpoint) {
        break
      }
    }
  }

  const semantics = meta?.responsiveSemanticElement

  if (semantics && result[semantics.prop] === undefined) {
    result[semantics.prop] =
      semantics.mapping[String(base[semantics.variantProp])] ?? semantics.fallback
  }

  return result
}
