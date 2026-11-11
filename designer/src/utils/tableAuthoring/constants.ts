import type { DataTableColumnConfig, PropSchema } from '@root/types/propSchema'

export const TABLE_MAX_COLUMNS = 20

export const TABLE_MAX_ROWS = 100

export const TABLE_INITIAL_COLUMNS = 6

export const TABLE_INITIAL_ROWS = 10

export const TABLE_CELL_CONTENTS = 'cellContents'

export const TABLE_COLUMNS: DataTableColumnConfig[] = Array.from(
  { length: TABLE_INITIAL_COLUMNS },
  (_, index) => ({
    key: `column_${index + 1}`,
    header: `Column${index + 1}`,
  }),
)

export const TABLE_DATA = Array.from({ length: TABLE_INITIAL_ROWS }, (_, row) =>
  Object.fromEntries(
    TABLE_COLUMNS.map((column, index) => [column.key, `Row ${row + 1}-${index + 1}`]),
  ),
)

export const TABLE_AUTHORING_SCHEMA: PropSchema[] = [
  { key: 'rows', label: 'Rows', type: 'arrayOfObjects', defaultValue: [] },
  {
    key: TABLE_CELL_CONTENTS,
    label: 'Cell contents',
    type: 'slot',
    defaultValue: null,
    slotAcceptsMultiple: true,
    slotShowPlaceholder: false,
    slotDescription:
      'Independent box per body cell, in row-major order. Edited directly on the table.',
  },
]
