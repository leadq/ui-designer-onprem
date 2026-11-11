import { FormField } from '@root/adapters/antd/FormField';
import type { RendererProps } from '@root/types/componentContract';
import { Switch } from 'antd';

export type SwitchRendererProps = RendererProps;

export const SwitchRenderer = ({
  renderMode: _renderMode,
  label,
  rootRef,
  rootClassName,
  style,
  'data-node-id': nodeId,
  ...props
}: SwitchRendererProps) => (
  <FormField
    {...{ label, rootClassName, rootRef, style, 'data-node-id': nodeId }}
    renderControl={(id) => <Switch {...props} aria-label={String(label ?? '')} id={id} />}
  />
);
