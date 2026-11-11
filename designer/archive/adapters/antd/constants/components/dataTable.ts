import { getAntTableJSX } from '@root/adapters/shared/tableExport/getAntTableJSX';
import { TABLE_AUTHORING_SCHEMA, TABLE_COLUMNS, TABLE_DATA } from '@root/utils/tableAuthoring/constants';
import { getInitialTableNode } from '@root/utils/tableAuthoring/getInitialTableNode';
import { DataTableRenderer } from '@root/adapters/antd/DataTableRenderer';
import { getBoolean } from '@root/adapters/antd/utils/getBoolean';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import { TABLE_CELL_SLOT } from '@root/adapters/shared/tableCellSchema';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignDataTableMeta: ComponentMeta = getMeta(
  'dataTable',
  'DataTable',
  'display',
  DataTableRenderer,
  'Table',
  {
    columns: TABLE_COLUMNS,
    data: TABLE_DATA,
    hasTableBorder: true,
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
    getBoolean('hasTableBorder', 'Table border', true),
    TABLE_CELL_SLOT,
  ],
);

antDesignDataTableMeta.tableContents = true;
antDesignDataTableMeta.tableColumnAlignment = true;
antDesignDataTableMeta.initializeNode = getInitialTableNode;

antDesignDataTableMeta.exportConfig.renderTableJSX = getAntTableJSX;
