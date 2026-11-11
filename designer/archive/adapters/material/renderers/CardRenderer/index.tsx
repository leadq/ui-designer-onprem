import type { RendererProps } from '@root/types/componentContract';

import { Card } from '@mui/material';

export type CardRendererProps = RendererProps;

export const CardRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  ...props
}: CardRendererProps) => <Card {...props} ref={rootRef} className={rootClassName} />;
