import type { ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';
import { Alert } from 'antd';

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
    ref={(instance) => rootRef?.(instance?.nativeElement ?? null)}
    showIcon
    className={rootClassName}
    description={children as ReactNode}
    message={title as ReactNode}
    type={severity as 'info' | 'success' | 'warning' | 'error'}
  />
);
