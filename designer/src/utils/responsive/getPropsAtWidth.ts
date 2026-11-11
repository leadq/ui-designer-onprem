import type { ComponentMeta } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getBreakpointForWidth } from '@root/utils/layout/getBreakpointForWidth'

import { getPropsAtBreakpoint } from './getPropsAtBreakpoint'

export const getPropsAtWidth = (node: DesignNode, width: number | null, meta?: ComponentMeta) =>
  getPropsAtBreakpoint(node, width === null ? 'xl' : getBreakpointForWidth(width), meta)
