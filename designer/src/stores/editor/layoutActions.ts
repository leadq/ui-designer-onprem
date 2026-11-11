import type { BreakpointKey } from '@root/constants/breakpoints'
import type { ColorProperty } from '@root/utils/colorTokens/types'
import type { LayoutAlignment, SizeAxis } from '@root/utils/layout/types'

export interface LayoutActions {
  updateColorToken: (
    ids: string[],
    breakpoint: BreakpointKey,
    property: ColorProperty,
    tokenId?: string,
  ) => void
  alignNode: (id: string, axis: SizeAxis, alignment: LayoutAlignment) => void
  centerNode: (id: string, axis: SizeAxis) => void
}
