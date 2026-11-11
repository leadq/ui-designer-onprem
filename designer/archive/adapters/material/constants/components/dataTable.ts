import { getTableJSX } from '@root/adapters/material/getTableJSX';
import { TABLE_AUTHORING_SCHEMA, TABLE_COLUMNS, TABLE_DATA } from '@root/utils/tableAuthoring/constants';
import { getInitialTableNode } from '@root/utils/tableAuthoring/getInitialTableNode';
import { DataTableRenderer } from '@root/adapters/material/DataTableRenderer';
import { getBoolean } from '@root/adapters/material/utils/getBoolean';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialDataTableMeta: ComponentMeta = getMeta(
  'dataTable',
  'DataTable',
  'display',
  DataTableRenderer,
  'Table',
  {
    columns: TABLE_COLUMNS,
    data: TABLE_DATA,
    isStriped: true,
    isHighlightOnHover: true,
    hasTableBorder: true,
    hasColumnBorders: false,
  },
  [
    ...TABLE_AUTHORING_SCHEMA,
    {
      key: '_tableEditor',
      label: 'Table Configuration',
      type: 'dataTable',
      defaultValue: null,
      tableConfig: { defaultColumns: 6, defaultRows: 10, maxColumns: 20, maxRows: 100 },
    },
    getBoolean('isStriped', 'Striped rows', true),
    getBoolean('isHighlightOnHover', 'Highlight hover', true),
    getBoolean('hasTableBorder', 'Table border', true),
    getBoolean('hasColumnBorders', 'Column borders'),
  ],
);

materialDataTableMeta.tableContents = true;
materialDataTableMeta.tableColumnAlignment = true;
materialDataTableMeta.initializeNode = getInitialTableNode;

materialDataTableMeta.exportConfig.additionalImports = ['TableHead', 'TableBody', 'TableRow', 'TableCell'];
materialDataTableMeta.exportConfig.renderTableJSX = getTableJSX;
