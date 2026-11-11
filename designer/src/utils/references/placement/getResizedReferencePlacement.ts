import type { ReferenceImage, ReferencePlacement } from '@root/types/references'

const CORNER_HANDLE_LENGTH = 2
const OPPOSITE_SIDES = 2
const HALF_SIZE_DIVISOR = 2
const MIN_REFERENCE_WIDTH = 64
const MAX_REFERENCE_WIDTH = 8192

export const getResizedReferencePlacement = (
  image: ReferenceImage,
  start: ReferencePlacement,
  handle: string,
  dx: number,
  dy: number,
): ReferencePlacement => {
  const ratio = image.height / image.width
  const horizontal = handle.includes('e') ? dx : handle.includes('w') ? -dx : 0
  const vertical = handle.includes('s') ? dy / ratio : handle.includes('n') ? -dy / ratio : 0

  const delta =
    handle.length === CORNER_HANDLE_LENGTH
      ? (horizontal + vertical) / CORNER_HANDLE_LENGTH
      : horizontal + vertical

  const width = Math.max(
    MIN_REFERENCE_WIDTH,
    Math.min(MAX_REFERENCE_WIDTH, start.width + delta * OPPOSITE_SIDES),
  )

  return {
    width,
    x: Math.max(0, start.x + (start.width - width) / HALF_SIZE_DIVISOR),
    y: Math.max(0, start.y + ((start.width - width) * ratio) / HALF_SIZE_DIVISOR),
  }
}
