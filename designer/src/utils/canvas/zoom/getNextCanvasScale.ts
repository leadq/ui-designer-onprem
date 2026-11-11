import { getScaleFromZoomLevel } from './getScaleFromZoomLevel'
import { getZoomLevelFromScale } from './getZoomLevelFromScale'

const PERCENT_SCALE = 100
const ZOOM_STEP_PERCENT = 10

/** Button steps follow the displayed percentage and stop at 100% when crossing it. */
export const getNextCanvasScale = (scale: number, direction: -1 | 1): number => {
  const percent = Math.round(getZoomLevelFromScale(scale) * PERCENT_SCALE)
  const next = percent + direction * ZOOM_STEP_PERCENT

  const crossesReset =
    (percent < PERCENT_SCALE && next >= PERCENT_SCALE) ||
    (percent > PERCENT_SCALE && next <= PERCENT_SCALE)

  return getScaleFromZoomLevel((crossesReset ? PERCENT_SCALE : next) / PERCENT_SCALE)
}
