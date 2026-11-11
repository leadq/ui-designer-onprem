import { Text as MantineText } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.
import type { ButtonRendererProps } from '../ButtonRenderer';

export type TextRendererProps = ButtonRendererProps;

export const TextRenderer = ({
  renderMode: _renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  ...props
}: TextRendererProps) => (
  <MantineText
    {...props}
    ref={rootRef}
    className={rootClassName}
    data-node-id={nodeId}
  />
);
