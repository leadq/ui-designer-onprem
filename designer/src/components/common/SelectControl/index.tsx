import { forwardRef, type SelectHTMLAttributes } from 'react'

import styles from './styles.module.scss'

export interface SelectControlProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'disabled'
> {
  isDisabled?: boolean
}

export const SelectControl = forwardRef<HTMLSelectElement, SelectControlProps>(
  ({ className = '', isDisabled, ...props }, ref) => (
    <select
      ref={ref}
      className={`${styles.selectControl} ${className}`}
      disabled={isDisabled}
      {...props}
    />
  ),
)

SelectControl.displayName = 'SelectControl'
