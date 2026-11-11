import type { RendererProps } from '@root/types/componentContract';
import { Flex, Rate } from 'antd';

export type RatingRendererProps = RendererProps;

export const RatingRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  style,
  'data-node-id': nodeId,
  label,
  onChange,
  ...props
}: RatingRendererProps) => (
  <Flex ref={rootRef} className={rootClassName} data-node-id={nodeId} style={style}>
    <Rate
      {...props}
      aria-label={String(label ?? 'Rating')}
      onChange={onChange as (value: number) => void}
    />
  </Flex>
);
