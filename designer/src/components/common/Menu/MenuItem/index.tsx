import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import styles from '../styles.module.scss'

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftSection?: ReactNode
  shouldCloseOnClick?: boolean
  color?: 'red'
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    { className = '', color, leftSection, shouldCloseOnClick = true, disabled, children, ...props },
    ref,
  ) => (
    <DropdownMenu.Item
      asChild
      disabled={disabled}
      onPointerLeave={(event) => {
        // Exit animation keeps the item mounted; do not move focus out of a new dialog.
        if (event.currentTarget.closest('[role="menu"]')?.getAttribute('data-state') === 'closed') {
          event.preventDefault()
        }
      }}
      onSelect={(event) => {
        if (!shouldCloseOnClick) {
          event.preventDefault()
        }
      }}
    >
      <button
        {...props}
        ref={ref}
        className={`${styles.menu__item} ${className}`}
        data-danger={color === 'red'}
        disabled={disabled}
        type='button'
      >
        {leftSection ? <span className={styles.menu__itemIcon}>{leftSection}</span> : null}
        <span className={styles.menu__itemLabel}>{children}</span>
      </button>
    </DropdownMenu.Item>
  ),
)

MenuItem.displayName = 'MenuItem'
