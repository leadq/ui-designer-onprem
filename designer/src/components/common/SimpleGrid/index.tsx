import type { CSSProperties, ReactNode } from 'react'

import styles from './styles.module.scss'

interface SimpleGridProps {
  cols?: number
  spacing?: number | string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export const SimpleGrid = ({
  cols = 2,
  spacing = 'var(--designer-spacing-sm)',
  children,
  className = '',
  style,
}: SimpleGridProps) => (
  <div
    className={[styles.simpleGrid, className].join(' ')}
    style={{
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: typeof spacing === 'number' ? `${spacing}px` : spacing,
      ...style,
    }}
  >
    {children}
  </div>
)
