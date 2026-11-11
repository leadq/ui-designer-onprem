import { ButtonBase } from '../ButtonBase'

import styles from './styles.module.scss'

interface SwitchProps {
  isChecked: boolean
  onChange: (checked: boolean) => void
  label?: string
  ariaLabel?: string
  isDisabled?: boolean
}

export const Switch = ({
  isChecked,
  onChange,
  label,
  ariaLabel,
  isDisabled = false,
}: SwitchProps) => {
  const switchClasses = [
    styles.switch,
    isChecked ? styles['switch--checked'] : '',
    isDisabled ? styles['switch--disabled'] : '',
  ].join(' ')

  return (
    <ButtonBase
      aria-checked={isChecked}
      aria-label={ariaLabel}
      className={switchClasses}
      isDisabled={isDisabled}
      role='switch'
      type='button'
      onClick={() => onChange(!isChecked)}
    >
      <div className={styles.switch__track}>
        <div className={styles.switch__thumb} />
      </div>
      {label ? <span className={styles.switch__label}>{label}</span> : null}
    </ButtonBase>
  )
}

export type { SwitchProps }
