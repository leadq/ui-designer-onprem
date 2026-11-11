import type { RendererProps } from '@root/types/componentContract';

import { Typography } from '@mui/material';

export type TextRendererProps = RendererProps;

export const TextRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  ...props
}: TextRendererProps) => <Typography {...props} ref={rootRef} className={rootClassName} />;
