import { type ConnectionGeometry, type Point } from './types'

const HALF_SIZE_DIVISOR = 2
const ARROW_TARGET_GAP_PX = 4
const LANE_OFFSET_PX = 12
const MAX_LANE_HEIGHT_RATIO = 0.15
const FORWARD_TARGET_HEIGHT_RATIO = 0.3
const BACKWARD_TARGET_HEIGHT_RATIO = 0.7
const SOURCE_EDGE_INSET_RATIO = 0.1
const MAX_BEND_PX = 160
const BEND_DISTANCE_RATIO = 0.45

/** Separate forward and return arrivals along the sides, with continuous curves. */
export const getConnectionRoutes = (edges: ConnectionGeometry[], origin: Point) => {
  const arrivals = new Map<string, number>()

  return edges.map(({ id, source, sourceFrame, targetFrame, isFrameSource }) => {
    const forward =
      Math.abs(targetFrame.left - sourceFrame.left) < 1
        ? targetFrame.top >= sourceFrame.top
        : targetFrame.left > sourceFrame.left

    const side = forward ? 'above' : 'below'
    const key = `${targetFrame.left}:${targetFrame.top}:${side}`
    const lane = arrivals.get(key) ?? 0

    arrivals.set(key, lane + 1)

    const startX = (forward ? source.right : source.left) - origin.x

    const endX =
      (forward ? targetFrame.left - ARROW_TARGET_GAP_PX : targetFrame.right + ARROW_TARGET_GAP_PX) -
      origin.x

    const offset = Math.min(lane * LANE_OFFSET_PX, targetFrame.height * MAX_LANE_HEIGHT_RATIO)

    const endY =
      targetFrame.top +
      targetFrame.height * (forward ? FORWARD_TARGET_HEIGHT_RATIO : BACKWARD_TARGET_HEIGHT_RATIO) +
      (forward ? offset : -offset) -
      origin.y

    // A hidden overlay belongs to its screen. Align that screen's exit with the
    // destination instead of bending from the centre of a much taller frame.
    const startY = isFrameSource
      ? Math.max(
          source.top + source.height * SOURCE_EDGE_INSET_RATIO - origin.y,
          Math.min(endY, source.bottom - source.height * SOURCE_EDGE_INSET_RATIO - origin.y),
        )
      : source.top + source.height / HALF_SIZE_DIVISOR - origin.y

    const direction = forward ? 1 : -1
    const bend = Math.min(MAX_BEND_PX, Math.abs(endX - startX) * BEND_DISTANCE_RATIO)
    const path = `M ${startX} ${startY} C ${startX + direction * bend} ${startY}, ${endX - direction * bend} ${endY}, ${endX} ${endY}`

    return { id, side, path }
  })
}
