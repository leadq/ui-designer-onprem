import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { FRAME_GAP } from '@root/constants/canvas/workspace'

import { getDeviceFrameLayout } from './getDeviceFrameLayout'

export const getWorkspaceSurfaceWidth = (frameCount: number) =>
  Math.max(1, frameCount) *
    Math.max(
      getDeviceFrameLayout(BREAKPOINT_MAP.xl).outerWidth,
      getDeviceFrameLayout(BREAKPOINT_MAP.wide).outerWidth,
    ) +
  Math.max(0, frameCount - 1) * FRAME_GAP
