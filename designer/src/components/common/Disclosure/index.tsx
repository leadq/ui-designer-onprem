import { type ReactNode } from 'react'
import { EditorIcon } from '@root/components/common/EditorIcon'

import styles from './styles.module.scss'

export interface DisclosureProps {
  children: ReactNode
  label: string
  indicator?: ReactNode
  isOpen?: boolean
  isScrollable?: boolean
  onToggle?: (open: boolean) => void
}

export const Disclosure = ({
  children,
  label,
  indicator,
  isOpen,
  isScrollable: scrollable = false,
  onToggle,
}: DisclosureProps) => (
  <details
    className={`${styles.disclosure} ${scrollable ? styles['disclosure--scrollable'] : ''}`}
    open={isOpen}
    onToggle={(event) => onToggle?.(event.currentTarget.open)}
  >
    <summary className={styles.disclosure__summary}>
      <span className={styles.disclosure__label}>{label}</span>
      {indicator ? <span className={styles.disclosure__indicator}>{indicator}</span> : null}
      <EditorIcon
        aria-hidden='true'
        className={styles.disclosure__chevron}
        name='chevronDown'
        size={16}
        strokeWidth={1.8}
      />
    </summary>
    <div className={styles.disclosure__content}>{children}</div>
  </details>
)
