import { MIN_CANVAS_SCALE, MIN_ZOOM_LEVEL, OVERVIEW_LEVEL, OVERVIEW_SCALE } from './constants'
import { getCanvasScale } from './getCanvasScale'

export const getZoomLevelFromScale = (scale: number): number => {
  const value = getCanvasScale(scale)

  return value >= 1
    ? value
    : value < OVERVIEW_SCALE
      ? MIN_ZOOM_LEVEL +
        ((value - MIN_CANVAS_SCALE) * (OVERVIEW_LEVEL - MIN_ZOOM_LEVEL)) /
          (OVERVIEW_SCALE - MIN_CANVAS_SCALE)
      : OVERVIEW_LEVEL + ((value - OVERVIEW_SCALE) * (1 - OVERVIEW_LEVEL)) / (1 - OVERVIEW_SCALE)
}
