import { ButtonBase } from '../ButtonBase'

import styles from './styles.module.scss'

export interface CheckboxProps {
  isDisabled?: boolean
  isChecked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export const Checkbox = ({
  isChecked,
  onChange,
  label,
  className = '',
  isDisabled = false,
}: CheckboxProps) => (
  <ButtonBase
    aria-checked={isChecked}
    aria-label={label}
    className={[styles.checkbox, isChecked ? styles['checkbox--checked'] : '', className].join(' ')}
    isDisabled={isDisabled}
    role='checkbox'
    type='button'
    onClick={() => onChange(!isChecked)}
  >
    <div aria-hidden='true' className={styles.checkbox__box} />
    {label ? <span className={styles.checkbox__label}>{label}</span> : null}
  </ButtonBase>
)
