import type { CSSProperties } from 'react'
import type { DesignNode } from '@root/types/document'

import { getBreakpointForWidth } from './getBreakpointForWidth'
import { getStyleAtBreakpoint } from './getStyleAtBreakpoint'

export const getStyleAtWidth = (
  node: DesignNode,
  width: number | null,
  defaultStyle: CSSProperties = {},
): CSSProperties =>
  getStyleAtBreakpoint(node, width === null ? 'xl' : getBreakpointForWidth(width), defaultStyle)
