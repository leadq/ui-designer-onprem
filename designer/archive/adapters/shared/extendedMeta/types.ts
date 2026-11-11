import type { ComponentMeta } from '@root/types/componentContract';

export type ExtendedType =
  'slider' | 'rating' | 'segmented' | 'accordion' | 'alert' | 'progress' | 'divider';
export type ExtendedRenderers = Record<ExtendedType, ComponentMeta['renderer']>;
