import type { DesignNode } from '@root/types/document'
import type { DataTableColumnConfig } from '@root/types/propSchema'

export type TableEdit =
  | { type: 'cell'; expected: DesignNode; value: DesignNode }
  | { type: 'insertColumn'; index: number }
  | { type: 'insertRow'; index: number }
  | { type: 'removeColumn'; index: number }
  | { type: 'removeRow'; index: number }
  | { type: 'align'; column: number; align?: DataTableColumnConfig['align'] }
  | { type: 'header'; column: number; text: string }
  | { type: 'text'; cellId: string; text: string }
  | { type: 'copy'; row: number; column: number; axis: 'row' | 'column' }
