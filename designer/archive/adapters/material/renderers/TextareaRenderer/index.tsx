import type { RendererProps } from '@root/types/componentContract';

import { TextInputRenderer } from '../TextInputRenderer';

export type TextareaRendererProps = RendererProps;

export const TextareaRenderer = (props: TextareaRendererProps) => (
  <TextInputRenderer {...props} multiline />
);
