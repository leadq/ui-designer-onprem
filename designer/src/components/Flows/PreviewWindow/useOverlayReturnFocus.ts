import { useEffect, useRef } from 'react'

export const useOverlayReturnFocus = (
  isOpen: boolean,
  getReturnFocus: () => HTMLElement | null,
  isEnabled: boolean,
) => {
  const wasOpen = useRef(false)

  useEffect(() => {
    const shouldRestore = isEnabled && wasOpen.current && !isOpen

    wasOpen.current = isOpen

    if (!shouldRestore) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const target = getReturnFocus()

      if (target?.getClientRects().length) {
        target.focus()
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [isOpen, getReturnFocus, isEnabled])
}
