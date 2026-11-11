import type { DesignNode } from '@root/types/document'

export interface DragActiveData {
  type?: string
  savedDesignId?: string
  isPaletteItem?: boolean
  displayName?: string
}

export type ActiveItem = DragActiveData | DesignNode
