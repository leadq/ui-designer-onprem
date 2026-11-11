import type { RendererProps } from '@root/types/componentContract';

import { TextField } from '@mui/material';

export type TextInputRendererProps = RendererProps;

export const TextInputRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  onClick,
  onMouseDownCapture,
  ...props
}: TextInputRendererProps) => (
  <TextField
    {...props}
    ref={rootRef}
    className={rootClassName}
    onClick={(event: React.MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;

      // A real label forwards its click to the input; process that forwarded click once.
      if (
        typeof onClick === 'function' &&
        event.currentTarget.contains(target) &&
        !target.closest('label')
      ) {
        onClick(event);
      }
    }}
    onMouseDownCapture={(event: React.MouseEvent<HTMLElement>) => {
      if (typeof onMouseDownCapture === 'function') {
        onMouseDownCapture(event);
      }

      // Keep a focused floating label from moving between mousedown and mouseup.
      if ((event.target as HTMLElement).closest('.MuiInputLabel-root')) {
        event.preventDefault();
      }
    }}
  />
);
