import type { RendererProps } from '@root/types/componentContract';

import { Checkbox, FormControlLabel, Radio, Switch } from '@mui/material';

export type ToggleRendererProps = RendererProps;

export const getToggle = (Control: typeof Checkbox | typeof Radio | typeof Switch) => {
  const ToggleRenderer = ({
    renderMode: _renderMode,
    rootClassName,
    rootRef,
    'data-node-id': nodeId,
    label,
    style,
    onChange,
    ...props
  }: ToggleRendererProps) => (
    <FormControlLabel
      ref={rootRef}
      className={rootClassName}
      data-node-id={nodeId}
      label={label as React.ReactNode}
      style={style}
      control={
        <Control {...props} onChange={onChange as React.ChangeEventHandler<HTMLInputElement>} />
      }
    />
  );

  return ToggleRenderer;
};
