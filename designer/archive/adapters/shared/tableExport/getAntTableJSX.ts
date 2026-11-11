import { getTableModel } from '@root/utils/tableAuthoring/getTableModel';
import type { DesignNode } from '@root/types/document';

export const getAntTableJSX = (node: DesignNode, cells: string[], attributes: string[]): string => {
  const { columns, rows } = getTableModel(node);
  const nativeColumns = columns.map((column, index) => `{ key: ${JSON.stringify(column.key)}, title: ${JSON.stringify(column.header)}, width: ${JSON.stringify(column.width)}, align: ${JSON.stringify(column.align)}, render: (_value: unknown, _record: unknown, index: number) => [${rows.map((_, row) => `(\n${cells[row * columns.length + index]}\n)`).join(', ')}][index] }`).join(',\n');

  return `<div ${attributes.join(' ')}><Table bordered={${Boolean(node.props.hasTableBorder)}} pagination={false} rowKey="id" dataSource={${JSON.stringify(rows)}} columns={[${nativeColumns}]} /></div>`;
};
