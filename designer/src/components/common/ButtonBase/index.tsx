import { type ButtonHTMLAttributes, forwardRef } from 'react'

import styles from './styles.module.scss'

/** Accessible foundation for buttons, tabs and canvas handles with specialized layouts. */
export interface ButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  isDisabled?: boolean
}

export const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ className = '', type = 'button', isDisabled, ...props }, ref) => (
    <button
      ref={ref}
      className={`${styles.buttonBase} ${className}`}
      disabled={isDisabled}
      type={type}
      {...props}
    />
  ),
)

ButtonBase.displayName = 'ButtonBase'
