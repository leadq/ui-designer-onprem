import type { RendererProps } from '@root/types/componentContract';
import { Flex } from 'antd';

export type BoxRendererProps = RendererProps;

export const BoxRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  style,
  ...props
}: BoxRendererProps) => (
  <Flex vertical {...props} ref={rootRef} className={rootClassName} style={style} />
);
