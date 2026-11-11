import type { RendererProps } from '@root/types/componentContract';

import { Slider } from '@mantine/core';

export type SliderRendererProps = RendererProps;

export const SliderRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  onChange,
  ...props
}: SliderRendererProps) => (
  <Slider
    {...props}
    ref={rootRef}
    className={rootClassName}
    thumbLabel={String(label ?? 'Amount')}
    onChange={onChange as (value: number) => void}
  />
);
