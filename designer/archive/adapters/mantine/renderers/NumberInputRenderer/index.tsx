import { NumberInput as MantineNumberInput } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.
import type { ButtonRendererProps } from '../ButtonRenderer';

export type NumberInputRendererProps = ButtonRendererProps;

export const NumberInputRenderer = ({
  renderMode: _renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  ...props
}: NumberInputRendererProps) => (
  <MantineNumberInput
    {...props}
    ref={(element) => rootRef?.(element?.closest<HTMLElement>('[data-node-id]') ?? null)}
    classNames={{ root: rootClassName }}
    wrapperProps={{ 'data-node-id': nodeId }}
  />
);
