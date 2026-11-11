import type { RendererProps } from '@root/types/componentContract';

import { Button } from '@mui/material';

export type ButtonRendererProps = RendererProps;

export const ButtonRenderer = ({
  renderMode,
  rootClassName,
  rootRef,
  disabled,
  style,
  ...props
}: ButtonRendererProps) => (
  <Button
    {...props}
    ref={rootRef}
    className={`${rootClassName ?? ''}${disabled ? ' Mui-disabled' : ''}`}
    disabled={Boolean(disabled) && renderMode !== 'design'}
    style={{ ...style, ...(renderMode === 'design' && disabled ? { pointerEvents: 'auto' } : {}) }}
  />
);
