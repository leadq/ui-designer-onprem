import { FormField } from '@root/adapters/antd/FormField';
import { getSelectOptions } from '@root/adapters/shared/getSelectOptions';
import type { RendererProps } from '@root/types/componentContract';
import { Select } from 'antd';

export type SelectRendererProps = RendererProps;

export const SelectRenderer = ({
  renderMode: _renderMode,
  data,
  label,
  onClick,
  rootClassName,
  rootRef,
  style,
  'data-node-id': nodeId,
  ...props
}: SelectRendererProps) => (
  <FormField
    {...{ label, rootClassName, rootRef, style, 'data-node-id': nodeId }}
    renderControl={(id) => <Select {...props} id={id} options={getSelectOptions(data)}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        // Native popup options live in a portal; their clicks are change events only.
        if (typeof onClick === 'function' && event.currentTarget.contains(event.target as Node)) {
          onClick(event);
        }
      }} />}
  />
);
