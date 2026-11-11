import type { RendererProps } from '@root/types/componentContract';

import { Box } from '@mui/material';

export type BoxRendererProps = RendererProps;

export const BoxRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  ...props
}: BoxRendererProps) => <Box {...props} ref={rootRef} className={rootClassName} />;
