import { Card as MantineCard } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.
import type { ButtonRendererProps } from '../ButtonRenderer';

export type CardRendererProps = ButtonRendererProps;

export const CardRenderer = ({
  renderMode: _renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  children,
  ...props
}: CardRendererProps) => (
  <MantineCard {...props} ref={rootRef} className={rootClassName} data-node-id={nodeId}>
    {children}
  </MantineCard>
);
