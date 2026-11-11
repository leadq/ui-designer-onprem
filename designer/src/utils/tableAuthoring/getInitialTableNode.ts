import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { v4 as uuidv4 } from 'uuid'

import {
  TABLE_CELL_CONTENTS,
  TABLE_COLUMNS,
  TABLE_INITIAL_COLUMNS,
  TABLE_INITIAL_ROWS,
} from './constants'
import { getTableCell } from './getTableCell'

export const getInitialTableNode = (node: DesignNode, registry: Registry): DesignNode => ({
  ...node,
  props: {
    ...node.props,
    columns: TABLE_COLUMNS.map((column) => ({ ...column, key: uuidv4() })),
    rows: Array.from({ length: TABLE_INITIAL_ROWS }, () => ({ id: uuidv4() })),
    data: [],
  },
  slots: {
    [TABLE_CELL_CONTENTS]: Array.from(
      { length: TABLE_INITIAL_ROWS * TABLE_INITIAL_COLUMNS },
      (_, index) =>
        getTableCell(
          registry,
          `Row ${Math.floor(index / TABLE_INITIAL_COLUMNS) + 1}-${(index % TABLE_INITIAL_COLUMNS) + 1}`,
        ),
    ),
  },
})
