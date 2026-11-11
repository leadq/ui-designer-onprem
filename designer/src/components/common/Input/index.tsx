import { forwardRef } from 'react'
import { useStableId } from '@root/hooks/useStableId'

import { InputControl, type InputControlProps } from '../InputControl'

import styles from './styles.module.scss'

interface InputProps extends InputControlProps {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = '',
      id,
      placeholder,
      type = 'text',
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useStableId()
    const inputId = id ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined

    const containerClasses = [
      styles.input,
      label ? styles['input--floating'] : '',
      error ? styles['input--error'] : '',
      className,
    ].join(' ')

    return (
      <div className={containerClasses}>
        <div
          className={styles.input__control}
          data-always-float={[
            'date',
            'datetime-local',
            'time',
            'month',
            'week',
            'color',
            'file',
            'range',
          ].includes(type)}
        >
          <InputControl
            ref={ref}
            aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={error ? true : undefined}
            className={styles.input__field}
            id={inputId}
            placeholder={label ? placeholder || ' ' : placeholder}
            type={type}
            {...props}
          />
          {label ? (
            <label className={styles.input__label} htmlFor={inputId}>
              {label}
            </label>
          ) : null}
        </div>
        {error ? (
          <span className={styles.input__errorMessage} id={errorId}>
            {error}
          </span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }

export type { InputProps }
