/** Use authored content, not headings whose readable size changes independently of zoom. */
export const getWheelZoomAnchor = (
  layer: HTMLElement,
  positionX: number,
  positionY: number,
): HTMLElement | null => {
  const candidates = layer.querySelectorAll<HTMLElement>(
    '[data-frame-surface] [data-design-interaction-surface], [data-reference-id]',
  )

  let closest: HTMLElement | null = null
  let distance = Infinity

  for (const candidate of candidates) {
    const rect = candidate.getBoundingClientRect()

    const nextDistance = Math.hypot(
      Math.max(rect.left - positionX, 0, positionX - rect.right),
      Math.max(rect.top - positionY, 0, positionY - rect.bottom),
    )

    if (rect.width > 0 && rect.height > 0 && nextDistance < distance) {
      closest = candidate

      distance = nextDistance
    }
  }

  return closest
}
