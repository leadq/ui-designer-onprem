import { forwardRef, type InputHTMLAttributes } from 'react'

import styles from './styles.module.scss'

/** Unwrapped field for tables and inline editors; Input adds the floating label and errors. */
export interface InputControlProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'disabled' | 'checked'
> {
  isDisabled?: boolean
  isChecked?: boolean
}

export const InputControl = forwardRef<HTMLInputElement, InputControlProps>(
  ({ className = '', isDisabled, isChecked, ...props }, ref) => (
    <input
      ref={ref}
      checked={isChecked}
      className={`${styles.inputControl} ${className}`}
      disabled={isDisabled}
      {...props}
    />
  ),
)

InputControl.displayName = 'InputControl'
