import { getSelectOptions } from '@root/adapters/shared/getSelectOptions';
import type { RendererProps } from '@root/types/componentContract';
import { Segmented } from 'antd';

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
  <Segmented
    {...props}
    ref={rootRef}
    aria-label={String(label ?? 'Period')}
    className={rootClassName}
    options={getSelectOptions(data)}
    onChange={onChange as (value: string | number) => void}
  />
);
