import type { RendererProps } from '@root/types/componentContract';
import { Flex, Slider } from 'antd';

export type SliderRendererProps = RendererProps;

export const SliderRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  style,
  'data-node-id': nodeId,
  label,
  onChange,
  ...props
}: SliderRendererProps) => (
  <Flex ref={rootRef} vertical className={rootClassName} data-node-id={nodeId} style={style}>
    <Slider
      {...props}
      ariaLabelForHandle={String(label ?? 'Amount')}
      onChange={onChange as (value: number) => void}
    />
  </Flex>
);
