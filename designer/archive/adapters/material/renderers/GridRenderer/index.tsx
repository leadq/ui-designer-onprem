import { Children } from 'react';

import type { RendererProps } from '@root/types/componentContract';

import { Grid } from '@mui/material';

export type GridRendererProps = RendererProps;

export const GridRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  children,
  ...props
}: GridRendererProps) => (
  <Grid {...props} ref={rootRef} container className={rootClassName}>
    {Children.map(children as React.ReactNode, (child) => (
      <Grid size={6}>{child}</Grid>
    ))}
  </Grid>
);
