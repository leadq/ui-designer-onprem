import { type Modifier } from '@dnd-kit/core'

const HALF_SIZE_DIVISOR = 2
const DEFAULT_DRAG_WIDTH = 220
const DEFAULT_DRAG_HEIGHT = 40

export const getCenteredDragOverlay = (
  { transform, draggingNodeRect, activatorEvent, overlayNodeRect }: Parameters<Modifier>[0],
  isPalette: boolean,
) => {
  const ae = activatorEvent as PointerEvent | null

  if (!draggingNodeRect || !ae) {
    return transform
  }

  const offsetX = ae.clientX - draggingNodeRect.left
  const offsetY = ae.clientY - draggingNodeRect.top

  const widthValue = isPalette
    ? draggingNodeRect.width
    : (overlayNodeRect?.width ?? DEFAULT_DRAG_WIDTH)

  const heightValue = isPalette
    ? draggingNodeRect.height
    : (overlayNodeRect?.height ?? DEFAULT_DRAG_HEIGHT)

  return {
    ...transform,
    x: transform.x + offsetX - widthValue / HALF_SIZE_DIVISOR,
    y: transform.y + offsetY - heightValue / HALF_SIZE_DIVISOR,
  }
}
