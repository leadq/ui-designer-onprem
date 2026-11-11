import type { ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';

import { Alert } from '@mantine/core';

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
    title={title as ReactNode}
    color={
      severity === 'error'
        ? 'red'
        : severity === 'success'
          ? 'green'
          : severity === 'warning'
            ? 'yellow'
            : 'blue'
    }
  >
    {children as ReactNode}
  </Alert>
);
