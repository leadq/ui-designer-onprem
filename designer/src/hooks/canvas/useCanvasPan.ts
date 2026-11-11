import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'

const isTyping = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))

export const useCanvasPan = (viewportRef: RefObject<HTMLDivElement>, isEnabled: boolean) => {
  const [isHandTool, setIsHandTool] = useState(false)
  const [isSpaceDown, setIsSpaceDown] = useState(false)
  const [isPanning, setIsPanning] = useState(false)

  const drag = useRef<{
    x: number
    y: number
    left: number
    top: number
    pointerId: number
  } | null>(null)

  const suppressClick = useRef(false)
  const isPointerInside = useRef(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !isEnabled ||
        event.code !== 'Space' ||
        !isPointerInside.current ||
        isTyping(event.target) ||
        document.querySelector('[aria-modal="true"]')
      ) {
        return
      }

      event.preventDefault()

      setIsSpaceDown(true)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setIsSpaceDown(false)
      }
    }

    const handleBlur = () => {
      drag.current = null

      setIsPanning(false)

      setIsSpaceDown(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    window.addEventListener('keyup', handleKeyUp)

    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)

      window.removeEventListener('keyup', handleKeyUp)

      window.removeEventListener('blur', handleBlur)
    }
  }, [isEnabled])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current

    suppressClick.current = false

    if (
      !isEnabled ||
      !viewport ||
      (event.target instanceof Element &&
        Boolean(event.target.closest('[data-frame-name] input'))) ||
      !(event.button === 1 || (event.button === 0 && (isHandTool || isSpaceDown)))
    ) {
      return
    }

    event.preventDefault()

    event.stopPropagation()

    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: viewport.scrollLeft,
      top: viewport.scrollTop,
      pointerId: event.pointerId,
    }

    viewport.setPointerCapture(event.pointerId)

    setIsPanning(true)

    suppressClick.current = true
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    const origin = drag.current

    if (!viewport || !origin) {
      return
    }

    event.preventDefault()

    event.stopPropagation()

    viewport.scrollLeft = origin.left - (event.clientX - origin.x)

    viewport.scrollTop = origin.top - (event.clientY - origin.y)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) {
      return
    }

    event.preventDefault()

    event.stopPropagation()

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    drag.current = null

    setIsPanning(false)
  }

  const handleClickCapture = (event: ReactMouseEvent) => {
    if (!isEnabled || !(suppressClick.current || isHandTool || isSpaceDown)) {
      return
    }

    event.preventDefault()

    event.stopPropagation()

    suppressClick.current = false
  }

  return {
    isHandTool,
    setIsHandTool,
    isGrabCursor: isEnabled && (isHandTool || isSpaceDown),
    isPanning,
    handlers: {
      onPointerEnter: () => {
        isPointerInside.current = true
      },
      onPointerLeave: () => {
        isPointerInside.current = false
      },
      onPointerDownCapture: handlePointerDown,
      onPointerMoveCapture: handlePointerMove,
      onPointerUpCapture: handlePointerUp,
      onPointerCancelCapture: handlePointerUp,
      onClickCapture: handleClickCapture,
      onAuxClickCapture: handleClickCapture,
    },
  }
}
