import { type RefObject, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useEditorStore } from '@root/stores/editor'
import { getWheelZoomAnchor } from '@root/utils/canvas/getWheelZoomAnchor'
import { getCanvasScale } from '@root/utils/canvas/zoom'

const WHEEL_ZOOM_SENSITIVITY = 0.003

export const useCanvasWheelZoom = (
  viewportRef: RefObject<HTMLDivElement | null>,
  layerRef: RefObject<HTMLDivElement | null>,
  isPreview: boolean,
) => {
  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const handleWheel = (event: WheelEvent) => {
      if (isPreview) {
        return
      }

      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()

        const state = useEditorStore.getState()

        const next = getCanvasScale(
          state.canvasZoom * Math.exp(-event.deltaY * WHEEL_ZOOM_SENSITIVITY),
        )

        const layer = layerRef.current

        if (!layer) {
          return
        }

        const anchor = getWheelZoomAnchor(viewport, event.clientX, event.clientY) ?? layer
        const before = anchor.getBoundingClientRect()
        const ratio = next / state.canvasZoom
        const left = event.clientX + (before.left - event.clientX) * ratio
        const top = event.clientY + (before.top - event.clientY) * ratio

        // Commit the readable heading/rail layout before correcting the camera.
        flushSync(() => state.setCanvasZoom(next))

        const after = anchor.getBoundingClientRect()

        viewport.scrollLeft += after.left - left

        viewport.scrollTop += after.top - top
      } else if (event.shiftKey && event.deltaY) {
        event.preventDefault()

        viewport.scrollLeft += event.deltaY + event.deltaX
      }
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })

    return () => viewport.removeEventListener('wheel', handleWheel)
  }, [isPreview, viewportRef, layerRef])
}
