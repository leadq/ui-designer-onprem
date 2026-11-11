import { forwardRef, type TextareaHTMLAttributes } from 'react'

import styles from './styles.module.scss'

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'disabled'
> {
  isDisabled?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', isDisabled, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`${styles.textarea} ${className}`}
      disabled={isDisabled}
      {...props}
    />
  ),
)

Textarea.displayName = 'Textarea'
