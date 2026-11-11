import { MAX_CANVAS_SCALE, MIN_CANVAS_SCALE } from './constants'

export const getCanvasScale = (scale: number): number =>
  Math.min(MAX_CANVAS_SCALE, Math.max(MIN_CANVAS_SCALE, Number.isFinite(scale) ? scale : 1))
