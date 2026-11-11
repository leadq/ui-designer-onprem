import { getTableModel } from '@root/utils/tableAuthoring/getTableModel';
import type { DataTableColumnConfig } from '@root/types/propSchema';
import type { DesignNode } from '@root/types/document';

interface TableTags {
  table: string;
  head: string;
  body: string;
  row: string;
  header: string;
  cell: string;
  alignment: 'style' | 'prop';
}

export const getNativeTableJSX = (
  node: DesignNode,
  cells: string[],
  attributes: string[],
  tags: TableTags,
  nativeProps: string[],
  rowProps = '',
): string => {
  const { columns, rows } = getTableModel(node);
  const getCellProps = (column: DataTableColumnConfig, isHeader: boolean): string => {
    const style = {
      ...(isHeader && column.width !== undefined ? { width: column.width } : {}),
      ...(tags.alignment === 'style' && column.align ? { textAlign: column.align } : {}),
    };

    return [
      ...(Object.keys(style).length ? [`style={${JSON.stringify(style)}}`] : []),
      ...(tags.alignment === 'prop' && column.align ? [`align={${JSON.stringify(column.align)}}`] : []),
    ].join(' ');
  };

  const headers = columns.map((column) =>
    `<${tags.header} ${getCellProps(column, true)}>{${JSON.stringify(column.header)}}</${tags.header}>`,
  ).join('\n');
  const body = rows.map((row, index) => {
    const content = columns.map((column, columnIndex) =>
      `<${tags.cell} ${getCellProps(column, false)}>\n${cells[index * columns.length + columnIndex]}\n</${tags.cell}>`,
    ).join('\n');

    return `<${tags.row} key={${JSON.stringify(row.id)}} ${rowProps}>\n${content}\n</${tags.row}>`;
  }).join('\n');

  return `<${tags.table} ${[...attributes, ...nativeProps].join(' ')}>\n<${tags.head}><${tags.row}>${headers}</${tags.row}></${tags.head}>\n<${tags.body}>${body}</${tags.body}>\n</${tags.table}>`;
};
