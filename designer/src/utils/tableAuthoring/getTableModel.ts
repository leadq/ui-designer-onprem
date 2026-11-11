import type { DesignNode } from '@root/types/document'
import type { DataTableColumnConfig } from '@root/types/propSchema'

import { TABLE_CELL_CONTENTS } from './constants'

export const getTableModel = (node: DesignNode) => ({
  columns: (node.props.columns ?? []) as DataTableColumnConfig[],
  rows: (node.props.rows ?? []) as { id: string }[],
  cells: node.slots?.[TABLE_CELL_CONTENTS] ?? [],
})
