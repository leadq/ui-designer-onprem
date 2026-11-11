import type { ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';

import { Table as MantineTable } from '@mantine/core';

type DataTableRendererProps = RendererProps;

interface DataTableColumn {
  key: string;
  header: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

export const DataTableRenderer = ({
  renderMode,
  renderCell,
  cellContents,
  rows: authoredRows,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  columns,
  data,
  isStriped,
  isHighlightOnHover,
  hasTableBorder,
  hasColumnBorders,
  ...props
}: DataTableRendererProps) => {
  const cols = Array.isArray(columns) ? (columns as DataTableColumn[]) : [];
  const rows = (Array.isArray(authoredRows) ? authoredRows : Array.isArray(data) ? data : []) as Record<string, unknown>[];
  const contents = Array.isArray(cellContents) ? cellContents as ReactNode[] : null;

  return (
    <MantineTable
      {...props}
      ref={rootRef}
      className={rootClassName}
      data-node-id={nodeId}
      highlightOnHover={isHighlightOnHover as boolean}
      striped={isStriped as boolean}
      withColumnBorders={hasColumnBorders as boolean}
      withBorder={hasTableBorder as boolean}
    >
      <thead>
        <tr>
          {cols.map((col) => (
            <th key={col.key} data-table-column={renderMode === 'design' ? col.key : undefined} style={{ width: col.width, textAlign: col.align }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={Array.isArray(authoredRows) ? String(row.id) : index}>
            {cols.map((col, columnIndex) => (
              <td key={col.key} style={{ textAlign: col.align }} data-table-row={renderMode === 'design' ? index : undefined} data-table-column={renderMode === 'design' ? col.key : undefined}>
                {contents ? contents[index * cols.length + columnIndex] : typeof renderCell === 'function' &&
                (renderMode === 'preview' || (index === 0 && columnIndex === 0))
                  ? (renderCell as (...args: unknown[]) => ReactNode)(
                      row?.[col.key],
                      row,
                      index,
                      col.key,
                    )
                  : String(row?.[col.key] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </MantineTable>
  );
};
