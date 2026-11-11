import type { PointerEvent } from 'react'

import { designDragState } from './state'

export const activateDesignDrag = (id: string, event: PointerEvent<HTMLDivElement>) =>
  designDragState.activators.get(id)?.(event)
