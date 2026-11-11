import type { RendererProps } from '@root/types/componentContract';

import { Progress } from '@mantine/core';

export type ProgressRendererProps = RendererProps;

export const ProgressRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  value = 40,
  ...props
}: ProgressRendererProps) => (
  <Progress
    {...props}
    ref={rootRef}
    aria-label={String(label ?? 'Progress')}
    className={rootClassName}
    value={Number(value)}
  />
);
