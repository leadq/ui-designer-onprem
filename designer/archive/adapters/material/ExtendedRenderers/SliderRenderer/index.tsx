import type { RendererProps } from '@root/types/componentContract';

import { Slider } from '@mui/material';

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
    aria-label={String(label ?? 'Amount')}
    className={rootClassName}
    valueLabelDisplay="auto"
    onChange={(_event, value) => {
      if (typeof onChange === 'function') {
        onChange(value);
      }
    }}
  />
);
