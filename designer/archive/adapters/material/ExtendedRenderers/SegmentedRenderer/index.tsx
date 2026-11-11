import { useState } from 'react';

import { getSelectOptions } from '@root/adapters/shared/getSelectOptions';
import type { RendererProps } from '@root/types/componentContract';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export type SegmentedRendererProps = RendererProps;

export const SegmentedRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  data,
  defaultValue = 'daily',
  value,
  onChange,
  ...props
}: SegmentedRendererProps) => {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <ToggleButtonGroup
      {...props}
      ref={rootRef}
      exclusive
      aria-label={String(label ?? 'Period')}
      className={rootClassName}
      value={value ?? selected}
      onChange={(_event, next: unknown) => {
        if (next !== null) {
          setSelected(next);

          if (typeof onChange === 'function') {
            onChange(next);
          }
        }
      }}
    >
      {getSelectOptions(data).map((option) => (
        <ToggleButton key={option.value} disabled={option.disabled} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
