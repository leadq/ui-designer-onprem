import type { RendererProps } from '@root/types/componentContract';

import { TextInputRenderer } from '../TextInputRenderer';

export type NumberInputRendererProps = RendererProps;

export const NumberInputRenderer = (props: NumberInputRendererProps) => (
  <TextInputRenderer {...props} type="number" />
);
