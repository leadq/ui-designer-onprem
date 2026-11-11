import type { HTMLAttributes, ReactNode } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'

import styles from './styles.module.scss'

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  isOpen: boolean
}

/** Retain the real subtree and its state even when reduced motion disables the transition. */
export const Collapse = ({ children, isOpen, className = '', ...props }: CollapseProps) => (
  <Collapsible.Root asChild open={isOpen}>
    <Collapsible.Content
      {...props}
      {...{ inert: isOpen ? undefined : '' }}
      forceMount
      aria-hidden={!isOpen}
      className={`${styles.collapse} ${className}`}
    >
      <div className={styles.collapse__content}>{children}</div>
    </Collapsible.Content>
  </Collapsible.Root>
)
