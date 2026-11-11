import { type RefObject, useEffect, useRef } from 'react'

/** Canvas interactions may stop bubbling; dismiss without cancelling the outside action. */
export const useOutsidePointerDismiss = (
  isOpen: boolean,
  triggerRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>,
  onClose: () => void,
) => {
  const closeRef = useRef(onClose)

  closeRef.current = onClose

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const ownerDocument = triggerRef.current?.ownerDocument ?? document

    const handlePointerDown = (event: PointerEvent) => {
      const path = event.composedPath()

      if (
        !path.includes(triggerRef.current as EventTarget) &&
        !path.includes(contentRef.current as EventTarget)
      ) {
        closeRef.current()
      }
    }

    ownerDocument.addEventListener('pointerdown', handlePointerDown, true)

    return () => ownerDocument.removeEventListener('pointerdown', handlePointerDown, true)
  }, [isOpen, triggerRef, contentRef])
}
