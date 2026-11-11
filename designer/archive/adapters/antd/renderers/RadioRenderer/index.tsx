import { type ReactNode } from 'react';

import { Box } from '@root/components/common/Box';
import type { RendererProps } from '@root/types/componentContract';
import { Radio } from 'antd';

export type RadioRendererProps = RendererProps;

export const RadioRenderer = ({
  renderMode: _renderMode,
  label,
  rootRef,
  rootClassName,
  style,
  'data-node-id': nodeId,
  ...props
}: RadioRendererProps) => (
  <Box ref={rootRef} className={rootClassName} data-node-id={nodeId} style={style}>
    <Radio {...props}>{label as ReactNode}</Radio>
  </Box>
);
