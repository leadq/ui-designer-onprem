export type BreakpointKey = 'xl' | 'wide' | 'lg' | 'md' | 'sm' | 'xs'

export const BREAKPOINT_MAP = {
  xl: 1440,
  wide: 1200,
  lg: 1024,
  md: 768,
  sm: 576,
  xs: 375,
} as const
