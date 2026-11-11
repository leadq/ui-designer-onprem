import { TextInput as MantineTextInput } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.
import type { ButtonRendererProps } from '../ButtonRenderer';

export type TextInputRendererProps = ButtonRendererProps;

export const TextInputRenderer = ({
  renderMode: _renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  ...props
}: TextInputRendererProps) => (
  <MantineTextInput
    {...props}
    ref={(element) => rootRef?.(element?.closest<HTMLElement>('[data-node-id]') ?? null)}
    classNames={{ root: rootClassName }}
    wrapperProps={{ 'data-node-id': nodeId }}
  />
);
