import type { CSSProperties, ReactNode } from 'react'

import { HeadingOrder } from '../constants'

import styles from '../styles.module.scss'

export interface HeadingProps {
  children: ReactNode
  id?: string
  order?: HeadingOrder
  className?: string
  style?: CSSProperties
}

export const Heading = ({
  children,
  id,
  order = HeadingOrder.H1,
  className = '',
  style,
}: HeadingProps) => {
  const Tag = `h${order}` as keyof JSX.IntrinsicElements
  const headingClasses = [styles.heading, styles[`heading--h${order}`], className].join(' ')

  return (
    <Tag className={headingClasses} id={id} style={style}>
      {children}
    </Tag>
  )
}
