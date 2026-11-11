import { type RefObject, useLayoutEffect, useRef, useState } from 'react'

import { getPopoverSide, type PopoverSide } from '../utils/getPopoverSide'

const POPOVER_WIDTH = 320
const CONTENT_PADDING = 24
const CONTENT_BORDER = 2
const DETACHED_GRACE_MS = 160

export const usePopoverPlacement = (
  anchor: HTMLElement,
  contentRef: RefObject<HTMLDivElement>,
  onClose: () => void,
) => {
  const boundary = anchor.closest<HTMLElement>('[data-editor-viewport]')
  const [side, setSide] = useState<PopoverSide>('top')
  const closeRef = useRef(onClose)

  closeRef.current = onClose

  useLayoutEffect(() => {
    let frame = 0
    let detachedSince: number | null = null

    const update = () => {
      if (!anchor.isConnected) {
        closeRef.current()

        return
      }

      const content = contentRef.current
      const bounds = boundary?.getBoundingClientRect()

      if (bounds && content) {
        const visible = {
          top: Math.max(0, bounds.top),
          left: Math.max(0, bounds.left),
          right: Math.min(window.innerWidth, bounds.right),
          bottom: Math.min(window.innerHeight, bounds.bottom),
        }

        const rect = anchor.getBoundingClientRect()

        if (
          rect.bottom <= visible.top ||
          rect.top >= visible.bottom ||
          rect.right <= visible.left ||
          rect.left >= visible.right
        ) {
          // Zoom scale and native scroll compensation settle on adjacent animation frames.
          detachedSince = detachedSince ?? performance.now()

          if (performance.now() - detachedSince >= DETACHED_GRACE_MS) {
            closeRef.current()

            return
          }
        } else {
          detachedSince = null
        }

        const naturalHeight = (content.firstElementChild?.scrollHeight ?? 0) + CONTENT_BORDER

        setSide(
          getPopoverSide(
            rect,
            visible,
            Math.min(POPOVER_WIDTH, bounds.width - CONTENT_PADDING),
            naturalHeight,
          ),
        )
      }

      frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)

    return () => cancelAnimationFrame(frame)
  }, [anchor, boundary, contentRef])

  return { boundary, side }
}
