import type { PropSchema } from '@root/types/propSchema';

export const getText = (key: string, label: string, defaultValue = ''): PropSchema => ({
  key,
  label,
  type: 'text',
  defaultValue,
});
