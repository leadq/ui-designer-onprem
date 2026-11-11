import { FormField } from '@root/adapters/antd/FormField';
import type { RendererProps } from '@root/types/componentContract';
import { Input } from 'antd';

export type TextInputRendererProps = RendererProps;

export const TextInputRenderer = ({
  renderMode: _renderMode,
  label,
  rootClassName,
  rootRef,
  style,
  'data-node-id': nodeId,
  ...props
}: TextInputRendererProps) => (
  <FormField
    {...{ label, rootClassName, rootRef, style, 'data-node-id': nodeId }}
    renderControl={(id) => <Input {...props} id={id} />}
  />
);
