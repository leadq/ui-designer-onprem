import { Box as MantineBox } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.
import type { ButtonRendererProps } from '../ButtonRenderer';

export type BoxRendererProps = ButtonRendererProps;

export const BoxRenderer = ({
  renderMode: _renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  children,
  ...props
}: BoxRendererProps) => (
  <MantineBox {...props} ref={rootRef} className={rootClassName} data-node-id={nodeId}>
    {children}
  </MantineBox>
);
