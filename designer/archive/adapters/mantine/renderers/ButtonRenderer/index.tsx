import type { RendererProps } from '@root/types/componentContract';

import { Button as MantineButton } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.

export interface ButtonRendererProps extends RendererProps {
  children?: React.ReactNode;
}

export const ButtonRenderer = ({
  renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  disabled,
  style,
  ...props
}: ButtonRendererProps) => (
  <MantineButton
    {...props}
    ref={rootRef}
    classNames={{ root: rootClassName }}
    data-disabled={Boolean(disabled) || undefined}
    data-node-id={nodeId}
    disabled={Boolean(disabled) && renderMode !== 'design'}
    style={{ ...style, ...(renderMode === 'design' && disabled ? { pointerEvents: 'auto' } : {}) }}
  />
);
