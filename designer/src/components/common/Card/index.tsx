import { type CSSProperties, type ReactNode } from 'react'

import { ButtonBase } from '../ButtonBase'

import styles from './styles.module.scss'

interface CardProps {
  children: ReactNode
  as?: 'div' | 'button'
  isDisabled?: boolean
  className?: string
  hasBorder?: boolean
  hasShadow?: boolean
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'
  style?: CSSProperties
  onClick?: () => void
}

const Card = ({
  children,
  as = 'div',
  isDisabled = false,
  className = '',
  hasBorder: withBorder = true,
  hasShadow: withShadow = false,
  padding = 'md',
  style,
  onClick,
}: CardProps) => {
  const cardClasses = [
    styles.card,
    as === 'button' ? styles['card--button'] : '',
    withBorder ? styles['card--withBorder'] : '',
    withShadow ? styles['card--withShadow'] : '',
    padding !== 'none' ? styles[`card--padding-${padding}`] : '',
    className,
  ].join(' ')

  if (as === 'button') {
    return (
      <ButtonBase
        className={cardClasses}
        isDisabled={isDisabled}
        style={style}
        type='button'
        onClick={onClick}
      >
        {children}
      </ButtonBase>
    )
  }

  return (
    <div className={cardClasses} style={style} onClick={onClick}>
      {children}
    </div>
  )
}

export { Card }

export type { CardProps }
