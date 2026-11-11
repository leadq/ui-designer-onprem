import type { DesignNode } from '@root/types/document'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'

import type { TableTarget } from '../types'

import { getAuthoredTables } from './getAuthoredTables'
import { getNativeTableCells } from './getNativeTableCells'

export const getTableHit = (
  nodes: DesignNode[],
  clientX: number,
  clientY: number,
): TableTarget | null => {
  const viewId = document
    .elementsFromPoint(clientX, clientY)
    .find((element) => element.closest('[data-view-id]'))
    ?.closest<HTMLElement>('[data-view-id]')?.dataset.viewId

  for (const node of getAuthoredTables(nodes).reverse()) {
    for (const cell of getNativeTableCells(node, viewId)) {
      const rect = cell.getBoundingClientRect()

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom ||
        !rect.width ||
        !rect.height
      ) {
        continue
      }

      const column = getTableModel(node).columns.findIndex(
        (item) => item.key === cell.dataset.tableColumn,
      )

      if (column < 0) {
        continue
      }

      return {
        node,
        column,
        row: cell.dataset.tableRow === undefined ? undefined : Number(cell.dataset.tableRow),
        x: clientX,
        y: clientY,
      }
    }
  }

  return null
}
