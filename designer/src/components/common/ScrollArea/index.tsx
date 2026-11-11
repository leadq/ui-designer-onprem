import type { CSSProperties, ReactNode } from 'react'

import styles from './styles.module.scss'

export const ScrollArea = ({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) => (
  <div className={[styles.scrollArea, className].join(' ')} style={style}>
    {children}
  </div>
)
