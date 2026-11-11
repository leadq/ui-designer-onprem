import type { DesignNode } from '@root/types/document'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'

export const getColumnValueType = (
  table: DesignNode,
  column: number,
): 'number' | 'text' | 'custom' | 'mixed' => {
  const { columns, cells, rows } = getTableModel(table)

  const types = rows.flatMap((_, row) => {
    const cell = cells[row * columns.length + column]

    if (
      !cell ||
      (!cell.children.length && !Object.values(cell.slots ?? {}).some((items) => items.length))
    ) {
      return []
    }

    if (
      cell.children.length !== 1 ||
      cell.children[0].type !== 'typography' ||
      cell.children[0].children.length ||
      Object.values(cell.slots ?? {}).some((items) => items.length) ||
      Object.values(cell.children[0].slots ?? {}).some((items) => items.length)
    ) {
      return ['custom']
    }

    const value = cell.children[0].props.children

    if (value === '' || (typeof value === 'string' && !value.trim())) {
      return []
    }

    if (typeof value === 'number') {
      return [Number.isFinite(value) ? 'number' : 'text']
    }

    if (typeof value !== 'string') {
      return ['custom']
    }

    // Both Turkish decimal comma and decimal point are accepted; formatted grouping is intentionally ambiguous.
    const isNumber =
      /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/.test(value.trim().toLowerCase()) &&
      Number.isFinite(Number(value.trim().replace(',', '.')))

    return [isNumber ? 'number' : 'text']
  })

  const unique = new Set(types)

  return unique.size > 1
    ? 'mixed'
    : unique.has('number')
      ? 'number'
      : unique.has('custom')
        ? 'custom'
        : 'text'
}
