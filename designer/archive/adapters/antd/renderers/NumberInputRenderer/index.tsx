import { FormField } from '@root/adapters/antd/FormField';
import type { RendererProps } from '@root/types/componentContract';
import { InputNumber } from 'antd';

export type NumberInputRendererProps = RendererProps;

export const NumberInputRenderer = ({
  renderMode: _renderMode,
  label,
  rootClassName,
  rootRef,
  style,
  'data-node-id': nodeId,
  ...props
}: NumberInputRendererProps) => (
  <FormField
    {...{ label, rootClassName, rootRef, style, 'data-node-id': nodeId }}
    renderControl={(id) => <InputNumber {...props} id={id} />}
  />
);
