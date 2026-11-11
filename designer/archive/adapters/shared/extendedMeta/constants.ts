import type { PropSchema } from '@root/types/propSchema';

export const DEFAULT_SLIDER_MAX = 100;

export const DEFAULT_SLIDER_STEP = 10;

export const DEFAULT_SLIDER_VALUE = 30;

export const DEFAULT_RATING_COUNT = 5;

export const DEFAULT_PROGRESS_VALUE = 40;

export const DISABLED: PropSchema = {
  key: 'disabled',
  label: 'Disabled',
  type: 'boolean',
  defaultValue: false,
};

export const OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];
