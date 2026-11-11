import type { CSSProperties, ReactNode } from 'react'

import { getGapValue } from '../utils/getGapValue'

import styles from '../styles.module.scss'

export interface StackProps {
  children: ReactNode
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  className?: string
  style?: CSSProperties
}

export const Stack = ({
  children,
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className = '',
  style,
}: StackProps) => {
  const stackClasses = [
    styles.stack,
    styles[`stack--align-${align}`],
    styles[`stack--justify-${justify}`],
    className,
  ].join(' ')

  return (
    <div className={stackClasses} style={{ ...style, gap: getGapValue(gap) }}>
      {children}
    </div>
  )
}
