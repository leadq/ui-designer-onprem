import { type HTMLAttributes, type ReactNode, useRef } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { getFloatingPosition } from '../../utils/getFloatingPosition'
import { useMenuConfiguration } from '../contexts/MenuConfigurationContext'

import styles from '../styles.module.scss'

export interface MenuDropdownProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const MenuDropdown = ({ className = '', style, ...props }: MenuDropdownProps) => {
  const { position, width, transition } = useMenuConfiguration()
  const contentRef = useRef<HTMLDivElement>(null)
  const hasInteractedOutsideRef = useRef(false)

  const handleCloseAutoFocus = (event: Event) => {
    const content = event.target instanceof HTMLElement ? event.target : contentRef.current
    const triggerId = content?.getAttribute('aria-labelledby')
    const trigger = triggerId ? document.getElementById(triggerId) : null
    const owningDialog = trigger?.closest('[aria-modal="true"]')

    const hasNewDialog = Array.from(
      document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'),
    ).some((dialog) => dialog !== owningDialog && dialog.getClientRects().length > 0)

    // Dialog autofocus may run before OR after this callback, depending on the browser.
    // Its presence, rather than the currently focused element, owns the handoff.
    const activeElement = document.activeElement

    const hasMovedFocus =
      activeElement &&
      activeElement !== document.body &&
      activeElement !== trigger &&
      !content?.contains(activeElement)

    // Radix's default trigger.focus() can scroll a transformed canvas back to the trigger.
    event.preventDefault()

    if (!hasNewDialog && !hasMovedFocus && !hasInteractedOutsideRef.current) {
      trigger?.focus({ preventScroll: true })
    }

    hasInteractedOutsideRef.current = false
  }

  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        {...props}
        {...getFloatingPosition(position)}
        ref={contentRef}
        loop
        className={`${styles.menu} ${className}`}
        collisionPadding={8}
        data-transition={transition}
        sideOffset={8}
        style={{ ...style, width }}
        onCloseAutoFocus={handleCloseAutoFocus}
        onEscapeKeyDown={(event) => event.stopPropagation()}
        onInteractOutside={(event) => {
          const triggerId = contentRef.current?.getAttribute('aria-labelledby')
          const trigger = triggerId ? document.getElementById(triggerId) : null
          const target = event.detail.originalEvent.target

          // The trigger owns toggling, including a reopen during the previous exit animation.
          if (target instanceof Node && trigger?.contains(target)) {
            event.preventDefault()
          } else {
            hasInteractedOutsideRef.current = true
          }
        }}
      />
    </DropdownMenu.Portal>
  )
}
