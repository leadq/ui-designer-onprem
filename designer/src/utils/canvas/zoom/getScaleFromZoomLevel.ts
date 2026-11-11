import { MIN_CANVAS_SCALE, MIN_ZOOM_LEVEL, OVERVIEW_LEVEL, OVERVIEW_SCALE } from './constants'
import { getCanvasScale } from './getCanvasScale'

/** Compress the zoom-out range: level 5% renders at 25%, while 100% stays 1:1. */
export const getScaleFromZoomLevel = (level: number): number =>
  getCanvasScale(
    level >= 1
      ? level
      : level < OVERVIEW_LEVEL
        ? MIN_CANVAS_SCALE +
          ((level - MIN_ZOOM_LEVEL) * (OVERVIEW_SCALE - MIN_CANVAS_SCALE)) /
            (OVERVIEW_LEVEL - MIN_ZOOM_LEVEL)
        : OVERVIEW_SCALE + ((level - OVERVIEW_LEVEL) * (1 - OVERVIEW_SCALE)) / (1 - OVERVIEW_LEVEL),
  )
