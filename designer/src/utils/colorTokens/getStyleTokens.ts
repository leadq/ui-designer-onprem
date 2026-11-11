import type { BreakpointKey } from '@root/constants/breakpoints'
import type { DesignNode } from '@root/types/document'

import type { StyleTokens } from './types'

const BREAKPOINTS = ['wide', 'lg', 'md', 'sm', 'xs'] as const

export const getStyleTokens = (node: DesignNode, breakpoint: BreakpointKey): StyleTokens => {
  const result = { ...node.styleTokens }

  if (breakpoint !== 'xl') {
    for (const key of BREAKPOINTS) {
      Object.assign(result, node.responsiveStyleTokens?.[key])

      if (key === breakpoint) {
        break
      }
    }
  }

  return result
}
