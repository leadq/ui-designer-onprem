import { type ReactNode } from 'react';

import { Box } from '@root/components/common/Box';
import type { RendererProps } from '@root/types/componentContract';
import { Checkbox } from 'antd';

export type CheckboxRendererProps = RendererProps;

export const CheckboxRenderer = ({
  renderMode: _renderMode,
  label,
  rootRef,
  rootClassName,
  style,
  'data-node-id': nodeId,
  ...props
}: CheckboxRendererProps) => (
  <Box ref={rootRef} className={rootClassName} data-node-id={nodeId} style={style}>
    <Checkbox {...props}>{label as ReactNode}</Checkbox>
  </Box>
);
