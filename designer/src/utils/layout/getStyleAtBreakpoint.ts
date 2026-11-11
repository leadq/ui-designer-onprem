import type { CSSProperties } from 'react'
import type { BreakpointKey } from '@root/constants/breakpoints'
import type { DesignNode } from '@root/types/document'

const COMPACT_BREAKPOINTS = ['wide', 'lg', 'md', 'sm', 'xs'] as const

// Later shorthands replace inherited edges even after JSON drops undefined values.
const mergeStyleLayer = (style: CSSProperties, layer: CSSProperties = {}): CSSProperties => {
  const result = { ...style }

  for (const kind of ['padding', 'margin'] as const) {
    if (
      ['Top', 'Right', 'Bottom', 'Left'].every(
        (side) => layer[`${kind}${side}` as keyof CSSProperties] !== undefined,
      )
    ) {
      delete result[kind]
    }

    if (layer[kind] !== undefined) {
      for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
        delete result[`${kind}${side}`]
      }
    }
  }

  return Object.assign(result, layer)
}

export const getStyleAtBreakpoint = (
  node: DesignNode,
  breakpoint: BreakpointKey,
  defaultStyle: CSSProperties = {},
): CSSProperties => {
  let style = mergeStyleLayer(defaultStyle, node.style)

  if (breakpoint === 'xl') {
    return style
  }

  for (const key of COMPACT_BREAKPOINTS) {
    style = mergeStyleLayer(style, node.responsiveStyles?.[key])

    if (key === breakpoint) {
      break
    }
  }

  return style
}
