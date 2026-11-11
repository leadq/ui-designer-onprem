import type { ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { EditorIcon } from '@root/components/common/EditorIcon'

import styles from '../styles.module.scss'

export interface MenuCheckboxItemProps {
  children: ReactNode
  isChecked: boolean
  isDisabled?: boolean
  onChange: (isChecked: boolean) => void
}

export const MenuCheckboxItem = ({
  children,
  isChecked,
  isDisabled,
  onChange,
}: MenuCheckboxItemProps) => (
  <DropdownMenu.CheckboxItem
    checked={isChecked}
    className={styles.menu__item}
    disabled={isDisabled}
    onCheckedChange={onChange}
    onSelect={(event) => event.preventDefault()}
  >
    <span aria-hidden className={styles.menu__check}>
      <DropdownMenu.ItemIndicator>
        <EditorIcon name='check' size={14} />
      </DropdownMenu.ItemIndicator>
    </span>
    <span className={styles.menu__itemLabel}>{children}</span>
  </DropdownMenu.CheckboxItem>
)
