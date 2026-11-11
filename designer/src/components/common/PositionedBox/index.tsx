import type { CSSProperties, HTMLAttributes } from 'react'

import { Box } from '../Box'

import styles from './styles.module.scss'

export interface PositionedBoxProps extends HTMLAttributes<HTMLDivElement> {
  bounds: { x: number; y: number; width?: number; height?: number }
  scale?: number
}

export const PositionedBox = ({
  bounds,
  scale = 1,
  className = '',
  ...props
}: PositionedBoxProps) => (
  <Box
    {...props}
    className={`${styles.positionedBox} ${className}`}
    style={
      {
        '--position-scale': scale,
        '--position-x': `${bounds.x}px`,
        '--position-y': `${bounds.y}px`,
        '--position-width': bounds.width === undefined ? 'auto' : `${bounds.width}px`,
        '--position-height': bounds.height === undefined ? 'auto' : `${bounds.height}px`,
      } as CSSProperties
    }
  />
)
