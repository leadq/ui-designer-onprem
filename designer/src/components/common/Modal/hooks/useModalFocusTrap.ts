import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.offsetParent !== null,
  )

const getFocusReturnElement = (): HTMLElement | null => {
  const activeElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null

  const parentMenu = activeElement?.closest<HTMLElement>('[role="menu"][aria-labelledby]')
  const menuTriggerId = parentMenu?.getAttribute('aria-labelledby')
  const menuTrigger = menuTriggerId ? document.getElementById(menuTriggerId) : null

  return menuTrigger instanceof HTMLElement ? menuTrigger : activeElement
}

interface UseModalFocusTrapOptions {
  isOpen: boolean
  isReady: boolean
  isEscapeCloseEnabled: boolean
  onClose: () => void
}

export const useModalFocusTrap = ({
  isOpen: opened,
  isReady: ready,
  isEscapeCloseEnabled: closeOnEscape,
  onClose,
}: UseModalFocusTrapOptions): RefObject<HTMLDivElement> => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Capture the opener before the portal mounts auto-focused child controls.
  useLayoutEffect(() => {
    if (opened) {
      previousFocusRef.current = getFocusReturnElement()
    }
  }, [opened])

  useEffect(() => {
    if (!opened || !ready) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const focusFrame = requestAnimationFrame(() => {
      if (modalRef.current?.contains(document.activeElement)) {
        return
      }

      const firstElement = modalRef.current ? getFocusableElements(modalRef.current)[0] : null

      ;(firstElement ?? modalRef.current)?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        event.preventDefault()

        event.stopImmediatePropagation()

        onClose()

        return
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return
      }

      const focusableElements = getFocusableElements(modalRef.current)
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (!firstElement || !lastElement) {
        event.preventDefault()

        modalRef.current.focus()
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()

        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()

        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(focusFrame)

      window.removeEventListener('keydown', handleKeyDown)

      document.body.style.overflow = previousBodyOverflow

      previousFocusRef.current?.focus()
    }
  }, [closeOnEscape, onClose, opened, ready])

  return modalRef
}
