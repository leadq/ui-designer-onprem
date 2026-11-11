import { getSelectOptions } from '@root/adapters/shared/getSelectOptions';

import { Select as MantineSelect } from '@mantine/core';

// Each wrapper receives rootClassName (the design system contract) and converts
// it to classNames.root (Mantine-specific mechanism). This keeps NodeRenderer
// fully UI-library agnostic.
import type { ButtonRendererProps } from '../ButtonRenderer';

export type SelectRendererProps = ButtonRendererProps;

export const SelectRenderer = ({
  renderMode: _renderMode,
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  data,
  defaultValue,
  ...props
}: SelectRendererProps) => (
  <MantineSelect
    {...props}
    ref={(element) => rootRef?.(element?.closest<HTMLElement>('[data-node-id]') ?? null)}
    classNames={{ root: rootClassName }}
    data={getSelectOptions(data)}
    defaultValue={Array.isArray(data) ? (defaultValue as string | null | undefined) : undefined}
    wrapperProps={{ 'data-node-id': nodeId }}
  />
);
