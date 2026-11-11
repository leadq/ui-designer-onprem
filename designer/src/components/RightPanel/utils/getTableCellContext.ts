import type { DesignNode } from '@root/types/document'
import { findNode, findParent } from '@root/utils/nodes'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'
import { isAuthoredTable } from '@root/utils/tableAuthoring/isAuthoredTable'

export const getTableCellContext = (nodes: DesignNode[], id: string) => {
  let cell = findNode(nodes, id)

  while (cell) {
    const parent = findParent(nodes, cell.id)

    if (!parent) {
      return null
    }

    if (isAuthoredTable(parent)) {
      const model = getTableModel(parent)
      const cellId = cell.id
      const index = model.cells.findIndex((item) => item.id === cellId)

      if (index < 0) {
        return null
      }

      return {
        table: parent,
        cell,
        column: index % model.columns.length,
        row: Math.floor(index / model.columns.length),
      }
    }

    cell = parent
  }

  return null
}
