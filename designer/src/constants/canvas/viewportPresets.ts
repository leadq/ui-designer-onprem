import { BREAKPOINT_MAP } from '@root/constants/breakpoints'

export const VIEWPORT_PRESETS = [
  { label: 'toolbar.wideScreen', width: BREAKPOINT_MAP.xl, key: 'xl' },
  { label: 'toolbar.desktopWide', width: BREAKPOINT_MAP.wide, key: 'wide' },
  { label: 'toolbar.desktop', width: BREAKPOINT_MAP.lg, key: 'lg' },
  { label: 'toolbar.tablet', width: BREAKPOINT_MAP.md, key: 'md' },
  { label: 'toolbar.largePhone', width: BREAKPOINT_MAP.sm, key: 'sm' },
  { label: 'toolbar.phone', width: BREAKPOINT_MAP.xs, key: 'xs' },
] as const
