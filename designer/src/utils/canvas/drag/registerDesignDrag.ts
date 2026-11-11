import type { PointerEvent } from 'react'

import { designDragState } from './state'

/** Forward editor-owned pointer input to the existing dnd-kit activator. */
export const registerDesignDrag = (
  id: string,
  activate?: (event: PointerEvent<HTMLDivElement>) => void,
) => {
  if (activate) {
    designDragState.activators.set(id, activate)
  } else {
    designDragState.activators.delete(id)
  }

  return () => {
    if (designDragState.activators.get(id) === activate) {
      designDragState.activators.delete(id)
    }
  }
}
