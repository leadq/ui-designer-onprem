import { getCanvasScale } from '../zoom'

import { FRAME_FOCUS_GUTTERS } from './constants/fitGutters'

interface FrameCameraInput {
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
  zoom: number
}

const OPPOSITE_SIDES = 2

/** Fit one measured surface including its title, keeping navigation controls clear. */
export const getFrameCamera = ({
  width,
  height,
  viewportWidth,
  viewportHeight,
  zoom,
}: FrameCameraInput) => {
  const availableWidth = Math.max(
    1,
    viewportWidth - FRAME_FOCUS_GUTTERS.horizontal * OPPOSITE_SIDES,
  )

  const availableHeight = Math.max(
    1,
    viewportHeight - FRAME_FOCUS_GUTTERS.top - FRAME_FOCUS_GUTTERS.bottom,
  )

  return {
    zoom: getCanvasScale(
      Math.min(1, zoom * Math.min(availableWidth / width, availableHeight / height)),
    ),
    centerX: viewportWidth / OPPOSITE_SIDES,
    centerY: FRAME_FOCUS_GUTTERS.top + availableHeight / OPPOSITE_SIDES,
  }
}
