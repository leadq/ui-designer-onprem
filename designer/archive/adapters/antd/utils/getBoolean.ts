import type { PropSchema } from '@root/types/propSchema';

export const getBoolean = (key: string, label: string, isDefaultValue = false): PropSchema => ({
  key,
  label,
  type: 'boolean',
  defaultValue: isDefaultValue,
});
