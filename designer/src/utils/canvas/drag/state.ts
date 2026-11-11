import type { PointerEvent } from 'react'

export const designDragState = {
  activators: new Map<string, (event: PointerEvent<HTMLDivElement>) => void>(),
}
