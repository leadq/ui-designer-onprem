import { type KeyboardEvent, useLayoutEffect, useRef } from 'react'
import { useStableId } from '@root/hooks/useStableId'
import { type ContextMenuPosition } from '@root/types/contextMenu'

const SECONDARY_MOUSE_BUTTON = 2
const VIEWPORT_MARGIN_PX = 8

export const useContextMenu = (position: ContextMenuPosition, onClose: () => void) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef(document.activeElement)
  const labelId = useStableId()
  const { x, y } = position

  useLayoutEffect(() => {
    const menu = menuRef.current

    if (!menu) {
      return
    }

    const updatePosition = () => {
      const rect = menu.getBoundingClientRect()

      menu.style.left = `${Math.max(VIEWPORT_MARGIN_PX, Math.min(x, window.innerWidth - rect.width - VIEWPORT_MARGIN_PX))}px`

      menu.style.top = `${Math.max(VIEWPORT_MARGIN_PX, Math.min(y, window.innerHeight - rect.height - VIEWPORT_MARGIN_PX))}px`
    }

    updatePosition()

    ;(
      menu.querySelector<HTMLButtonElement>('button:not(:disabled):not([data-danger])') ?? menu
    ).focus({ preventScroll: true })

    const observer = new ResizeObserver(updatePosition)

    observer.observe(menu)

    window.addEventListener('resize', updatePosition)

    const handleOutside = (event: PointerEvent) => {
      // Keep the menu mounted until contextmenu can prevent the browser default.
      if (event.button === SECONDARY_MOUSE_BUTTON || event.ctrlKey) {
        return
      }

      if (event.target instanceof Node && !menu.contains(event.target)) {
        onClose()
      }
    }

    const handleContextMenu = (event: MouseEvent) => {
      if (!event.ctrlKey) {
        event.preventDefault()
      }

      if (event.ctrlKey || (event.target instanceof Node && !menu.contains(event.target))) {
        onClose()
      }
    }

    document.addEventListener('pointerdown', handleOutside)

    document.addEventListener('contextmenu', handleContextMenu, true)

    return () => {
      observer.disconnect()

      window.removeEventListener('resize', updatePosition)

      document.removeEventListener('pointerdown', handleOutside)

      document.removeEventListener('contextmenu', handleContextMenu, true)
    }
  }, [x, y, onClose])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()

      event.stopPropagation()

      onClose()

      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus({ preventScroll: true })
      }
    } else if (event.key === 'Tab') {
      onClose()
    } else if (
      ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
    ) {
      event.preventDefault()

      event.stopPropagation()

      const buttons = Array.from(
        menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
      )

      const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
      const isForward = event.key === 'ArrowDown' || event.key === 'ArrowRight'

      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? buttons.length - 1
            : index < 0
              ? isForward
                ? 0
                : buttons.length - 1
              : (index + (isForward ? 1 : -1) + buttons.length) % buttons.length

      buttons[next]?.focus()
    }
  }

  return { menuRef, labelId, handleKeyDown }
}
