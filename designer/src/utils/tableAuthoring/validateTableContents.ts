import type { DesignNode } from '@root/types/document'

import { TABLE_CELL_CONTENTS, TABLE_MAX_COLUMNS, TABLE_MAX_ROWS } from './constants'
import { getTableModel } from './getTableModel'

export const validateTableContents = (node: DesignNode): void => {
  if (
    node.props.rows === undefined &&
    !node.slots?.[TABLE_CELL_CONTENTS] &&
    (node.props[TABLE_CELL_CONTENTS] === undefined || node.props[TABLE_CELL_CONTENTS] === null)
  ) {
    return
  }

  const { columns, rows, cells } = getTableModel(node)

  const hasUniqueIds = (values: unknown[], key: string) => {
    const ids = values.map((value) =>
      value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined,
    )

    return (
      ids.every((id) => typeof id === 'string' && id.length > 0) && new Set(ids).size === ids.length
    )
  }

  if (
    !Array.isArray(node.props.rows) ||
    !Array.isArray(node.props.columns) ||
    node.children.length > 0 ||
    !columns.length ||
    columns.length > TABLE_MAX_COLUMNS ||
    !rows.length ||
    rows.length > TABLE_MAX_ROWS ||
    !hasUniqueIds(columns, 'key') ||
    !hasUniqueIds(rows, 'id') ||
    !columns.every(
      (column) =>
        typeof column.header === 'string' &&
        (column.align === undefined || ['left', 'center', 'right'].includes(column.align)),
    ) ||
    cells.length !== rows.length * columns.length ||
    cells.some((cell) => cell.type !== 'box') ||
    (node.props[TABLE_CELL_CONTENTS] !== null && node.props[TABLE_CELL_CONTENTS] !== undefined) ||
    (node.props.renderCell !== null && node.props.renderCell !== undefined) ||
    node.slots?.renderCell?.length ||
    (node.props.data !== undefined &&
      (!Array.isArray(node.props.data) || node.props.data.length > 0))
  ) {
    throw new Error(
      `${node.id}: independent table requires unique columns/rows and one inline box per body cell (row-major); data/renderCell must be empty`,
    )
  }
}
