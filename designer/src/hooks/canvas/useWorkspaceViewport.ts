import { type RefObject, useLayoutEffect, useRef, useState } from 'react'

const HALF_SIZE_DIVISOR = 2
const MIN_VIEWPORT_PADDING_PX = 80

/** Start with three viewports across and two down; content expands the extent, independently of zoom. */
export const useWorkspaceViewport = (
  viewportRef: RefObject<HTMLDivElement>,
  isPreview: boolean,
) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const previousOrigin = useRef({ x: 80, y: 80 })

  const origin = {
    x: isPreview ? MIN_VIEWPORT_PADDING_PX : Math.max(MIN_VIEWPORT_PADDING_PX, size.width),
    y: isPreview
      ? MIN_VIEWPORT_PADDING_PX
      : Math.max(MIN_VIEWPORT_PADDING_PX, size.height / HALF_SIZE_DIVISOR),
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const update = () => {
      const next = { width: viewport.clientWidth, height: viewport.clientHeight }

      setSize((previous) =>
        previous.width === next.width && previous.height === next.height ? previous : next,
      )
    }

    update()

    let pendingFrame: number | null = null

    const scheduleUpdate = () => {
      if (pendingFrame !== null) {
        return
      }

      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = null

        update()
      })
    }

    const observer = new ResizeObserver(scheduleUpdate)

    observer.observe(viewport)

    return () => {
      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame)
      }

      observer.disconnect()
    }
  }, [viewportRef])

  useLayoutEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    // Reposition the camera with the origin so resizing panels does not move the artwork.
    viewport.scrollLeft += origin.x - previousOrigin.current.x

    viewport.scrollTop += origin.y - previousOrigin.current.y

    previousOrigin.current = { x: origin.x, y: origin.y }
  }, [origin.x, origin.y, viewportRef])

  return { width: size.width, height: size.height, originX: origin.x, originY: origin.y }
}
