import { FormField } from '@root/adapters/antd/FormField';
import type { RendererProps } from '@root/types/componentContract';
import { Input } from 'antd';

export type TextareaRendererProps = RendererProps;

export const TextareaRenderer = ({
  renderMode: _renderMode,
  minRows = 2,
  label,
  rootClassName,
  rootRef,
  style,
  'data-node-id': nodeId,
  ...props
}: TextareaRendererProps) => (
  <FormField
    {...{ label, rootClassName, rootRef, style, 'data-node-id': nodeId }}
    renderControl={(id) => (
      <Input.TextArea {...props} autoSize={{ minRows: Number(minRows) }} id={id} />
    )}
  />
);
