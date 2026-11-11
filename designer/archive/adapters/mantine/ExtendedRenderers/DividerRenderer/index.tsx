import type { ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';

import { Divider } from '@mantine/core';

export type DividerRendererProps = RendererProps;

export const DividerRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  ...props
}: DividerRendererProps) => (
  <Divider {...props} ref={rootRef} className={rootClassName} label={label as ReactNode} />
);
