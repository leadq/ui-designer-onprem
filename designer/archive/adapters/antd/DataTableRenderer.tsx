import type { ReactNode } from 'react';

import { Box } from '@root/components/common/Box';
import type { DataTableColumnConfig } from '@root/types/propSchema';
import type { RendererProps } from '@root/types/componentContract';
import { getDataRows } from '@root/utils/getDataRows';
import { Table } from 'antd';

export type DataTableRendererProps = RendererProps;

export const DataTableRenderer = ({
  rootRef,
  rootClassName,
  style,
  'data-node-id': nodeId,
  renderMode,
  renderCell,
  cellContents,
  rows: authoredRows,
  columns,
  data,
  isStriped: _isStriped,
  isHighlightOnHover: _isHighlightOnHover,
  hasTableBorder,
  hasColumnBorders: _hasColumnBorders,
  onClick,
  ...props
}: DataTableRendererProps) => {
  const rows = getDataRows(Array.isArray(authoredRows) ? authoredRows : data);
  const contents = Array.isArray(cellContents) ? cellContents as ReactNode[] : null;
  const columnCount = Array.isArray(columns) ? columns.length : 0;

  const render =
    typeof renderCell === 'function' ? (renderCell as (...args: unknown[]) => ReactNode) : null;

  const tableColumns = (Array.isArray(columns) ? (columns as DataTableColumnConfig[]) : []).map(
    (column, columnIndex) => ({
      key: column.key,
      title: column.header,
      dataIndex: column.key,
      width: column.width,
      align: column.align,
      onHeaderCell: () => ({ title: column.header, 'data-table-column': renderMode === 'design' ? column.key : undefined }),
      onCell: (_record: unknown, index?: number) => ({ title: undefined, 'data-table-column': renderMode === 'design' ? column.key : undefined, 'data-table-row': renderMode === 'design' ? index : undefined }),
      render: (value: unknown, record: Record<string, unknown>, index: number) =>
        contents ? contents[index * columnCount + columnIndex] : render && (renderMode === 'preview' || (index === 0 && columnIndex === 0))
          ? render(value, record, index, column.key)
          : String(value ?? ''),
    }),
  );

  return (
    <Box
      ref={rootRef}
      className={rootClassName}
      data-node-id={nodeId}
      style={style}
      onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
    >
      <Table
        {...props}
        bordered={Boolean(hasTableBorder)}
        columns={tableColumns}
        dataSource={rows}
        pagination={false}
        rowKey={(_row, index) => Array.isArray(authoredRows) ? String(_row.id) : String(index)}
      />
    </Box>
  );
};
