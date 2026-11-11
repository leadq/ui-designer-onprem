import type { ReactNode } from 'react'

import styles from './styles.module.scss'

interface BadgeProps {
  children: ReactNode
  color?: 'blue' | 'green' | 'red' | 'gray' | 'note'
  className?: string
}

export const Badge = ({ children, color = 'blue', className = '' }: BadgeProps) => (
  <span className={[styles.badge, styles[`badge--${color}`], className].join(' ')}>{children}</span>
)
