import { getBoolean } from '@root/adapters/material/utils/getBoolean';
import { getSelect } from '@root/adapters/material/utils/getSelect';
import { getText } from '@root/adapters/material/utils/getText';

export const COLORS = ['primary', 'secondary', 'success', 'error', 'info', 'warning'];

export const FIELD_SCHEMA = [
  getText('label', 'Label', 'Text Input'),
  getText('placeholder', 'Placeholder', ''),
  getText('helperText', 'Helper text', ''),
  getSelect('variant', 'Variant', ['outlined', 'filled', 'standard'], 'outlined'),
  getSelect('size', 'Size', ['small', 'medium'], 'small'),
  getBoolean('required', 'Required'),
  getBoolean('disabled', 'Disabled'),
  getBoolean('fullWidth', 'Full width', true),
];

export const TOGGLE_SCHEMA = [
  getText('label', 'Label', ''),
  getBoolean('defaultChecked', 'Checked'),
  getBoolean('disabled', 'Disabled'),
  getSelect('color', 'Color', COLORS, 'primary'),
  getSelect('size', 'Size', ['small', 'medium'], 'medium'),
];

export const FIELD_DEFAULTS = { variant: 'outlined', size: 'small', fullWidth: true };

export const TOGGLE_DEFAULTS = { defaultChecked: false, color: 'primary', size: 'medium' };
