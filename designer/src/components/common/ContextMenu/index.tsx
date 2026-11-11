import { createPortal } from 'react-dom'
import type { ContextMenuGroup, ContextMenuPosition } from '@root/types/contextMenu'

import { useContextMenu } from './hooks/useContextMenu'

export type {
  ContextMenuAction,
  ContextMenuGroup,
  ContextMenuPosition,
} from '@root/types/contextMenu'

import { ButtonBase } from '../ButtonBase'

import styles from './styles.module.scss'

export interface ContextMenuProps {
  position: ContextMenuPosition
  label: string
  groups: ContextMenuGroup[]
  onClose: () => void
}

export const ContextMenu = ({ position, label, groups, onClose }: ContextMenuProps) => {
  const { menuRef, labelId, handleKeyDown } = useContextMenu(position, onClose)

  return createPortal(
    <div
      ref={menuRef}
      aria-label={label}
      className={styles.contextMenu}
      role='menu'
      tabIndex={-1}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={handleKeyDown}
      onContextMenu={(event) => {
        if (!event.ctrlKey) {
          event.preventDefault()
        }

        event.stopPropagation()
      }}
    >
      {groups
        .filter((group) => group.items.length)
        .map((group) => (
          <div
            key={group.id}
            aria-labelledby={`${labelId}-${group.id}`}
            className={styles.contextMenu__group}
            role='group'
          >
            <div className={styles.contextMenu__label} id={`${labelId}-${group.id}`}>
              {group.label}
            </div>
            {group.items.map((item) => (
              <ButtonBase
                key={item.id}
                className={styles.contextMenu__item}
                data-danger={item.danger || undefined}
                data-inline={item.inline || undefined}
                isDisabled={item.disabled}
                role='menuitem'
                tabIndex={-1}
                onClick={() => {
                  onClose()

                  item.onSelect()
                }}
              >
                <span aria-hidden className={styles.contextMenu__itemIcon}>
                  {item.icon}
                </span>
                <span className={styles.contextMenu__itemText}>{item.label}</span>
                {item.shortcut ? (
                  <span aria-hidden className={styles.contextMenu__itemShortcut}>
                    {item.shortcut}
                  </span>
                ) : null}
              </ButtonBase>
            ))}
          </div>
        ))}
    </div>,
    document.body,
  )
}
