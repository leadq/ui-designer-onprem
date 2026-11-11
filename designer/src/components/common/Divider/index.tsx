import styles from './styles.module.scss'

interface DividerProps {
  label?: string
  className?: string
  variant?: 'line' | 'heading'
}

export const Divider = ({ label, className = '', variant = 'line' }: DividerProps) => (
  <div
    className={[
      styles.divider,
      label ? styles['divider--withLabel'] : '',
      variant === 'heading' ? styles['divider--heading'] : '',
      className,
    ].join(' ')}
  >
    {label ? <span className={styles.divider__label}>{label}</span> : null}
  </div>
)
