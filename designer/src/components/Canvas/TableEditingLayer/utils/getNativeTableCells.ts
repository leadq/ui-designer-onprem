import type { DesignNode } from '@root/types/document'
import { getNodeElement } from '@root/utils/canvas/hitTesting'

export const getNativeTableCells = (node: DesignNode, viewId?: string): HTMLElement[] => {
  const root = getNodeElement(node.id, viewId)
  const table = root?.matches('table') ? root : root?.querySelector('table')

  return table
    ? Array.from(table.querySelectorAll<HTMLElement>('[data-table-column]')).filter(
        (cell) => cell.closest('table') === table,
      )
    : []
}
