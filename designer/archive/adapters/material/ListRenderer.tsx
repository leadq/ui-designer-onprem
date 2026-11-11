import type { RendererProps } from '@root/types/componentContract';

import { Box } from '@mui/material';

import { ListContent } from '../shared/ListContent';

export type ListRendererProps = RendererProps;

export const ListRenderer = ({
  rootClassName,
  rootRef,
  data,
  renderItem,
  renderMode,
  ...props
}: ListRendererProps) => (
  <Box
    {...props}
    ref={rootRef}
    className={rootClassName}
    data-item-count={Array.isArray(data) ? data.length : 0}
  >
    <ListContent data={data} renderItem={renderItem} renderMode={renderMode} />
  </Box>
);
