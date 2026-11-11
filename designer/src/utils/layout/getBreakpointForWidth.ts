import { BREAKPOINT_MAP, type BreakpointKey } from '@root/constants/breakpoints'

export const getBreakpointForWidth = (width: number): BreakpointKey => {
  if (width >= BREAKPOINT_MAP.xl) {
    return 'xl'
  }

  if (width >= BREAKPOINT_MAP.wide) {
    return 'wide'
  }

  if (width >= BREAKPOINT_MAP.lg) {
    return 'lg'
  }

  if (width >= BREAKPOINT_MAP.md) {
    return 'md'
  }

  if (width >= BREAKPOINT_MAP.sm) {
    return 'sm'
  }

  return 'xs'
}
