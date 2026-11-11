import type { PropSchema } from '@root/types/propSchema';

export const getText = (key: string, label: string, defaultValue: string): PropSchema => ({
  key,
  label,
  type: 'text',
  defaultValue,
});
