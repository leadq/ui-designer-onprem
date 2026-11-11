import type { RendererProps } from '@root/types/componentContract';

import { LinearProgress } from '@mui/material';

export type ProgressRendererProps = RendererProps;

export const ProgressRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  value = 40,
  ...props
}: ProgressRendererProps) => (
  <LinearProgress
    {...props}
    ref={rootRef}
    aria-label={String(label ?? 'Progress')}
    className={rootClassName}
    value={Number(value)}
    variant="determinate"
  />
);
