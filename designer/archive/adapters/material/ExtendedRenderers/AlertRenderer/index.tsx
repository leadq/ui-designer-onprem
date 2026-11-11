import { type ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';

import { Alert, AlertTitle } from '@mui/material';

export type AlertRendererProps = RendererProps;

export const AlertRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  severity,
  title,
  children,
  ...props
}: AlertRendererProps) => (
  <Alert
    {...props}
    ref={rootRef}
    className={rootClassName}
    severity={severity as 'info' | 'success' | 'warning' | 'error'}
  >
    <AlertTitle>{title as ReactNode}</AlertTitle>
    {children as ReactNode}
  </Alert>
);
