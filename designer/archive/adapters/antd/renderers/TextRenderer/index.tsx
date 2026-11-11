import type { RendererProps } from '@root/types/componentContract';
import { Typography } from 'antd';

export type TextRendererProps = RendererProps;

export const TextRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  ...props
}: TextRendererProps) => <Typography.Text {...props} ref={rootRef} className={rootClassName} />;
