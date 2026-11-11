import type { ReactNode } from 'react';

import { Box } from '@root/components/common/Box';
import type { RendererProps } from '@root/types/componentContract';
import { Divider } from 'antd';

export type DividerRendererProps = RendererProps;

export const DividerRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  ...props
}: DividerRendererProps) => (
  <Box {...props} ref={rootRef} className={rootClassName}>
    <Divider>{label as ReactNode}</Divider>
  </Box>
);
