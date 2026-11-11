import { getNativeTableJSX } from '@root/adapters/shared/tableExport/getNativeTableJSX';
import { TABLE_AUTHORING_SCHEMA, TABLE_COLUMNS, TABLE_DATA } from '@root/utils/tableAuthoring/constants';
import { getInitialTableNode } from '@root/utils/tableAuthoring/getInitialTableNode';
/* eslint-disable camelcase */
import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { DataTableRenderer } from './renderers';

import { TABLE_CELL_SLOT } from '../shared/tableCellSchema';

export const mantineDataTableMeta: ComponentMeta = {
  type: 'dataTable',
  tableContents: true,
  tableColumnAlignment: true,
  initializeNode: getInitialTableNode,
  displayName: 'DataTable',
  searchKeywords: ['tablo', 'veri', 'liste', 'satır', 'sütun'],
  category: 'display',
  isContainer: false,
  defaultProps: {
    columns: TABLE_COLUMNS,
    data: TABLE_DATA,
    isStriped: true,
    isHighlightOnHover: true,
    hasTableBorder: true,
    hasColumnBorders: false,
  },
  defaultStyle: {},
  propsSchema: [
    TABLE_CELL_SLOT,
    ...TABLE_AUTHORING_SCHEMA,
    {
      key: '_tableEditor',
      label: 'Table Configuration',
      type: 'dataTable',
      defaultValue: null,
      tableConfig: {
        defaultColumns: 6,
        defaultRows: 10,
        maxColumns: 20,
        maxRows: 100,
      },
    },
    { key: 'isStriped', label: 'Striped Rows', type: 'boolean', defaultValue: true },
    { key: 'isHighlightOnHover', label: 'Highlight Hover', type: 'boolean', defaultValue: true },
    { key: 'hasTableBorder', label: 'Table Border', type: 'boolean', defaultValue: true },
    { key: 'hasColumnBorders', label: 'Column Borders', type: 'boolean', defaultValue: false },
  ],
  renderer: DataTableRenderer,
  exportConfig: getMantineExportConfig(
    'Table',
    'Rebuild this semantic table configuration with the target project table conventions.',
  ),
};

mantineDataTableMeta.exportConfig.renderTableJSX = (node, cells, attributes) => getNativeTableJSX(node, cells, attributes,
  { table: 'Table', head: 'thead', body: 'tbody', row: 'tr', header: 'th', cell: 'td', alignment: 'style' },
  [`striped={${Boolean(node.props.isStriped)}}`, `highlightOnHover={${Boolean(node.props.isHighlightOnHover)}}`, `withBorder={${Boolean(node.props.hasTableBorder)}}`, `withColumnBorders={${Boolean(node.props.hasColumnBorders)}}`]);
