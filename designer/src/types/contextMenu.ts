import type { ReactNode } from 'react'

export interface ContextMenuPosition {
  x: number
  y: number
}

export interface ContextMenuAction {
  id: string
  label: string
  icon: ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  inline?: boolean
  onSelect: () => void
}

export interface ContextMenuGroup {
  id: string
  label: string
  items: ContextMenuAction[]
}
