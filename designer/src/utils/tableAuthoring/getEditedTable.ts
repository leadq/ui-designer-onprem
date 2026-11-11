import type { Registry } from '@root/types/componentContract'
import type { DesignNode, SlotComponent } from '@root/types/document'
import { getClonedNodesForReuse } from '@root/utils/nodes/getClonedNodesForReuse'
import { v4 as uuidv4 } from 'uuid'

import { TABLE_CELL_CONTENTS, TABLE_MAX_COLUMNS, TABLE_MAX_ROWS } from './constants'
import { getMaterializedTableCell } from './getMaterializedTableCell'
import { getTableCell } from './getTableCell'
import { getTableModel } from './getTableModel'
import { getTableWithEditedCell } from './getTableWithEditedCell'
import { isAuthoredTable } from './isAuthoredTable'
import type { TableEdit } from './types'

export const getEditedTable = (
  source: DesignNode,
  edit: TableEdit,
  registry: Registry,
  savedDesigns: SlotComponent[] = [],
): DesignNode => {
  if (!isAuthoredTable(source)) {
    return source
  }

  if (edit.type === 'cell') {
    return getTableWithEditedCell(source, edit.expected, edit.value)
  }

  const node: DesignNode = {
    ...source,
    props: {
      ...source.props,
      columns: [...(source.props.columns as unknown[])],
      rows: [...(source.props.rows as unknown[])],
    },
  }

  const { columns, rows, cells } = getTableModel(node)
  const matrix = rows.map((_, row) => cells.slice(row * columns.length, (row + 1) * columns.length))

  switch (edit.type) {
    case 'insertColumn':
      if (columns.length >= TABLE_MAX_COLUMNS || edit.index < 0 || edit.index > columns.length) {
        return source
      }

      columns.splice(edit.index, 0, { key: uuidv4(), header: `Column${columns.length + 1}` })

      matrix.forEach((row) => {
        row.splice(edit.index, 0, getTableCell(registry))
      })

      break
    case 'insertRow':
      if (rows.length >= TABLE_MAX_ROWS || edit.index < 0 || edit.index > rows.length) {
        return source
      }

      rows.splice(edit.index, 0, { id: uuidv4() })

      matrix.splice(
        edit.index,
        0,
        columns.map(() => getTableCell(registry)),
      )

      break
    case 'removeColumn':
      if (columns.length <= 1 || !columns[edit.index]) {
        return source
      }

      columns.splice(edit.index, 1)

      matrix.forEach((row) => {
        row.splice(edit.index, 1)
      })

      break
    case 'removeRow':
      if (rows.length <= 1 || !rows[edit.index]) {
        return source
      }

      rows.splice(edit.index, 1)

      matrix.splice(edit.index, 1)

      break
    case 'align':
      if (
        !registry[source.type]?.tableColumnAlignment ||
        !columns[edit.column] ||
        (edit.align !== undefined && !['left', 'center', 'right'].includes(edit.align))
      ) {
        return source
      }

      columns[edit.column] = { ...columns[edit.column], align: edit.align }

      break
    case 'header':
      if (!columns[edit.column]) {
        return source
      }

      columns[edit.column] = { ...columns[edit.column], header: edit.text }

      break

    case 'text': {
      const cell = cells.find((item) => item.id === edit.cellId)

      if (
        !cell ||
        (cell.children.length &&
          (cell.children.length !== 1 ||
            cell.children[0].type !== 'typography' ||
            cell.children[0].children.length))
      ) {
        return source
      }

      const index = cells.indexOf(cell)

      const children = cell.children.length
        ? [{ ...cell.children[0], props: { ...cell.children[0].props, children: edit.text } }]
        : getTableCell(registry, edit.text).children

      matrix[Math.floor(index / columns.length)][index % columns.length] = { ...cell, children }

      break
    }

    case 'copy': {
      const cell = matrix[edit.row]?.[edit.column]

      if (!cell) {
        return source
      }

      matrix.forEach((row, rowIndex) => {
        row.forEach((target, columnIndex) => {
          if (
            target.id !== cell.id &&
            (edit.axis === 'row' ? rowIndex === edit.row : columnIndex === edit.column)
          ) {
            // Preserve the destination's structural cell ID; clone all content and settings independently.
            row[columnIndex] = {
              ...getClonedNodesForReuse(
                [getMaterializedTableCell(cell, registry, savedDesigns)],
                new Map([[cell.id, target.id]]),
              )[0],
            }
          }
        })
      })

      break
    }

    default:
      return source
  }

  node.slots = { ...node.slots, [TABLE_CELL_CONTENTS]: matrix.flat() }

  return node
}
