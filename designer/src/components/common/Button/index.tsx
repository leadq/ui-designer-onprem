import { forwardRef, type ReactNode } from 'react'

import { ButtonBase, type ButtonBaseProps } from '../ButtonBase'

import styles from './styles.module.scss'

interface ButtonProps extends ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'light' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  isFullWidth?: boolean
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth: fullWidth = false,
      className = '',
      children,
      isDisabled,
      ...props
    },
    ref,
  ) => {
    const buttonClasses = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      fullWidth ? styles['button--fullWidth'] : '',
      className,
    ].join(' ')

    return (
      <ButtonBase
        ref={ref}
        className={buttonClasses}
        isDisabled={isDisabled || isLoading}
        {...props}
      >
        {isLoading ? <span className={styles.button__loading} /> : null}
        {!isLoading && children}
      </ButtonBase>
    )
  },
)

Button.displayName = 'Button'

export { Button }

export type { ButtonProps }
