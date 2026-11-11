import type { DesignNode } from '@root/types/document'
import { findNode } from '@root/utils/nodes'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'
import { isAuthoredTable } from '@root/utils/tableAuthoring/isAuthoredTable'

export const getTableColumnSelection = (nodes: DesignNode[], ids: string[], key: string | null) => {
  const table = key && ids.length === 1 ? findNode(nodes, ids[0]) : null

  const column =
    table && isAuthoredTable(table)
      ? getTableModel(table).columns.findIndex((item) => item.key === key)
      : -1

  return table && column >= 0 ? { table, column } : null
}
