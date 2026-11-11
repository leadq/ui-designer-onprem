export interface PopoverRect {
  top: number
  right: number
  bottom: number
  left: number
}

export type PopoverSide = 'top' | 'bottom' | 'right' | 'left'

/** Prefer vertical placement; use lateral space before shrinking a tall editor tool. */
export const getPopoverSide = (
  anchor: PopoverRect,
  boundary: PopoverRect,
  width: number,
  height: number,
): PopoverSide => {
  const clearance = 25 // Boundary padding, offset and arrow.

  const candidates: { side: PopoverSide; available: number; required: number }[] = [
    { side: 'top', available: anchor.top - boundary.top - clearance, required: height },
    { side: 'bottom', available: boundary.bottom - anchor.bottom - clearance, required: height },
    { side: 'right', available: boundary.right - anchor.right - clearance, required: width },
    { side: 'left', available: anchor.left - boundary.left - clearance, required: width },
  ]

  return (
    candidates.find(({ available, required }) => available >= required) ??
    candidates.reduce((best, candidate) =>
      candidate.available / candidate.required > best.available / best.required ? candidate : best,
    )
  ).side
}
