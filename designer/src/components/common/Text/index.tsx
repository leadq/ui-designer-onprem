import { type CSSProperties, forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { TextWeight } from './constants'

import styles from './styles.module.scss'

interface TextProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'color'> {
  children: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight?: TextWeight
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'inherit'
  className?: string
  style?: CSSProperties
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    { children, size = 'sm', weight = 400, color = 'primary', className = '', style, ...props },
    ref,
  ) => {
    const textClasses = [
      styles.text,
      styles[`text--size-${size}`],
      styles[`text--weight-${weight}`],
      styles[`text--color-${color}`],
      className,
    ].join(' ')

    return (
      <p ref={ref} className={textClasses} style={style} {...props}>
        {children}
      </p>
    )
  },
)

Text.displayName = 'Text'

export type { HeadingProps } from './Heading'

export { Heading } from './Heading'

export { Text }

export type { TextProps }
