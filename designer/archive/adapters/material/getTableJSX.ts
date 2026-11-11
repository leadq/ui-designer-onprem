import { getNativeTableJSX } from '@root/adapters/shared/tableExport/getNativeTableJSX';
import type { DesignNode } from '@root/types/document';

export const getTableJSX = (node: DesignNode, cells: string[], attributes: string[]): string => {
  const nativeStyle = {
    border: node.props.hasTableBorder ? '1px solid' : undefined,
    borderColor: 'divider',
    '& td, & th': { borderRight: node.props.hasColumnBorders ? '1px solid rgba(0,0,0,0.12)' : undefined },
    '& tbody tr:nth-of-type(odd)': { backgroundColor: node.props.isStriped ? 'action.hover' : undefined },
  };

  return getNativeTableJSX(node, cells, attributes,
    { table: 'Table', head: 'TableHead', body: 'TableBody', row: 'TableRow', header: 'TableCell', cell: 'TableCell', alignment: 'prop' },
    [`sx={${JSON.stringify(nativeStyle)}}`], `hover={${Boolean(node.props.isHighlightOnHover)}}`,
  );
};
