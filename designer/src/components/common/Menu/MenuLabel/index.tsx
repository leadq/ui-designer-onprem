import type { HTMLAttributes, ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import styles from '../styles.module.scss'

export interface MenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const MenuLabel = ({ className = '', ...props }: MenuLabelProps) => (
  <DropdownMenu.Label className={`${styles.menu__label} ${className}`} {...props} />
)
