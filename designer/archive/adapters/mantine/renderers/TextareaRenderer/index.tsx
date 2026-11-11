import { Textarea as MantineTextarea } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.
import type { ButtonRendererProps } from '../ButtonRenderer';

export type TextareaRendererProps = ButtonRendererProps;

export const TextareaRenderer = ({
  renderMode: _renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  ...props
}: TextareaRendererProps) => (
  <MantineTextarea
    {...props}
    ref={(element) => rootRef?.(element?.closest<HTMLElement>('[data-node-id]') ?? null)}
    classNames={{ root: rootClassName }}
    wrapperProps={{ 'data-node-id': nodeId }}
  />
);
