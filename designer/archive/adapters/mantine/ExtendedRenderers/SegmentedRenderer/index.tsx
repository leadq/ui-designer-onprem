import { getSelectOptions } from '@root/adapters/shared/getSelectOptions';
import type { RendererProps } from '@root/types/componentContract';

import { SegmentedControl } from '@mantine/core';

export type SegmentedRendererProps = RendererProps;

export const SegmentedRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  data,
  onChange,
  ...props
}: SegmentedRendererProps) => (
  <SegmentedControl
    {...props}
    ref={rootRef}
    aria-label={String(label ?? 'Period')}
    className={rootClassName}
    data={getSelectOptions(data)}
    onChange={onChange as (value: string) => void}
  />
);
