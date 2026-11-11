import type { PropSchema } from '@root/types/propSchema';

export const getSelect = (
  key: string,
  label: string,
  options: string[],
  defaultValue: string,
): PropSchema => ({ key, label, type: 'select', options, defaultValue });
