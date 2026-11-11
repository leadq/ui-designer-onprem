import { Children } from 'react';

import { Grid as MantineGrid } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.
import type { ButtonRendererProps } from '../ButtonRenderer';

export type GridRendererProps = ButtonRendererProps;

export const GridRenderer = ({
  renderMode: _renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  children,
  ...props
}: GridRendererProps) => (
  <MantineGrid {...props} ref={rootRef} className={rootClassName} data-node-id={nodeId}>
    {Children.map(children, (child) => (
      <MantineGrid.Col span={6}>{child}</MantineGrid.Col>
    ))}
  </MantineGrid>
);
