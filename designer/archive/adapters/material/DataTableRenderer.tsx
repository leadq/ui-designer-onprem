import type { ReactNode } from 'react';

import type { DataTableColumnConfig } from '@root/types/propSchema';
import type { RendererProps } from '@root/types/componentContract';

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export type DataTableRendererProps = RendererProps;

export const DataTableRenderer = ({
  renderMode,
  renderCell,
  cellContents,
  rows: authoredRows,
  rootClassName,
  rootRef,
  columns,
  data,
  isStriped,
  isHighlightOnHover,
  hasTableBorder,
  hasColumnBorders,
  ...props
}: DataTableRendererProps) => {
  const tableColumns = Array.isArray(columns) ? (columns as DataTableColumnConfig[]) : [];
  const rows = (Array.isArray(authoredRows) ? authoredRows : Array.isArray(data) ? data : []) as Record<string, unknown>[];
  const contents = Array.isArray(cellContents) ? cellContents as ReactNode[] : null;

  return (
    <Table
      {...props}
      ref={rootRef}
      className={rootClassName}
      sx={{
        border: hasTableBorder ? '1px solid' : undefined,
        borderColor: 'divider',
        '& td, & th': { borderRight: hasColumnBorders ? '1px solid rgba(0,0,0,0.12)' : undefined },
        '& tbody tr:nth-of-type(odd)': { backgroundColor: isStriped ? 'action.hover' : undefined },
      }}
    >
      <TableHead>
        <TableRow>
          {tableColumns.map((column) => (
            <TableCell key={column.key} data-table-column={renderMode === 'design' ? column.key : undefined} align={column.align} style={{ width: column.width }}>
              {column.header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={Array.isArray(authoredRows) ? String(row.id) : index} hover={Boolean(isHighlightOnHover)}>
            {tableColumns.map((column, columnIndex) => (
              <TableCell key={column.key} data-table-row={renderMode === 'design' ? index : undefined} data-table-column={renderMode === 'design' ? column.key : undefined} align={column.align}>
                {contents ? contents[index * tableColumns.length + columnIndex] : typeof renderCell === 'function' &&
                (renderMode === 'preview' || (index === 0 && columnIndex === 0))
                  ? (renderCell as (...args: unknown[]) => ReactNode)(
                      row?.[column.key],
                      row,
                      index,
                      column.key,
                    )
                  : String(row?.[column.key] ?? '')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
