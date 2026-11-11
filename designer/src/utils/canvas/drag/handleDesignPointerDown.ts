import type { PointerEvent } from 'react'

import { getCanvasElementsFromPoint } from '../hitTesting/getCanvasElementsFromPoint'
import { resolveNodeId } from '../hitTesting/resolveNodeId'

import { activateDesignDrag } from './activateDesignDrag'

/** Frame edges can receive rounded pointer coordinates just outside a thin native root. */
export const handleDesignPointerDown = (event: PointerEvent<HTMLDivElement>) => {
  if (event.button !== 0) {
    return
  }

  const hit = getCanvasElementsFromPoint(event.clientX, event.clientY).find((element) =>
    resolveNodeId(element),
  )

  const id = hit && resolveNodeId(hit)
  const viewId = hit?.closest<HTMLElement>('[data-view-id]')?.dataset.viewId

  if (id) {
    event.stopPropagation()

    activateDesignDrag(viewId ? `${viewId}::${id}` : id, event)
  }
}
