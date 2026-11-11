import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { FRAME_GAP } from '@root/constants/canvas/workspace'

export const getWorkspaceSurfaceWidth = (frameCount: number) =>
  Math.max(1, frameCount) * Math.max(BREAKPOINT_MAP.xl, BREAKPOINT_MAP.wide) +
  Math.max(0, frameCount - 1) * FRAME_GAP
