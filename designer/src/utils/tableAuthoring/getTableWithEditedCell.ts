import type { DesignNode } from '@root/types/document'

import { getTableModel } from './getTableModel'

/** Apply only to the same unchanged structural cell; other cells retain identity. */
export const getTableWithEditedCell = (
  table: DesignNode,
  expected: DesignNode,
  value: DesignNode,
): DesignNode => {
  const cells = getTableModel(table).cells
  const current = cells.find((cell) => cell.id === expected.id)

  if (
    !current ||
    value.id !== current.id ||
    value.type !== 'box' ||
    JSON.stringify(current) !== JSON.stringify(expected)
  ) {
    return table
  }

  return {
    ...table,
    slots: {
      ...table.slots,
      cellContents: cells.map((cell) =>
        cell.id === current.id ? (JSON.parse(JSON.stringify(value)) as DesignNode) : cell,
      ),
    },
  }
}
