import type { CSSProperties } from 'react'
import type { BreakpointKey } from '@root/constants/breakpoints'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { getStyleAtBreakpoint } from '@root/utils/layout/getStyleAtBreakpoint'
import { getEditedSpacingStyle } from '@root/utils/layout/spacing/getEditedSpacingStyle'
import { getPropsAtBreakpoint } from '@root/utils/responsive/getPropsAtBreakpoint'

export const getNodeStyleEdit = (
  node: DesignNode,
  breakpoint: BreakpointKey,
  patch: CSSProperties,
) => {
  const meta = registry[node.type]

  const defaults = {
    ...meta?.defaultStyle,
    ...meta?.getDefaultLayoutStyle?.(getPropsAtBreakpoint(node, breakpoint, meta)),
  }

  const current = breakpoint === 'xl' ? node.style : (node.responsiveStyles?.[breakpoint] ?? {})

  return getEditedSpacingStyle(current, getStyleAtBreakpoint(node, breakpoint, defaults), patch)
}
