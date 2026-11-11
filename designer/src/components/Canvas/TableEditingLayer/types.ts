import type { DesignNode } from '@root/types/document'

export interface TableTarget {
  node: DesignNode
  column: number
  row?: number
  x: number
  y: number
}

export interface TableTextDraft {
  tableId: string
  column: number
  cellId?: string
  text: string
}

export interface TableBounds {
  tableId: string
  zoom: number
  headers: { x: number; y: number; width: number; height: number }[]
  appendColumn: { x: number; y: number; width: number; height: number }
  appendRow: { x: number; y: number }
}
