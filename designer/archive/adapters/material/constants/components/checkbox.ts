import { TOGGLE_DEFAULTS, TOGGLE_SCHEMA } from '@root/adapters/material/constants/schema';
import { CheckboxRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialCheckboxMeta: ComponentMeta = getMeta(
  'checkbox',
  'Checkbox',
  'form',
  CheckboxRenderer,
  'Checkbox',
  { ...TOGGLE_DEFAULTS, label: 'Checkbox Label' },
  TOGGLE_SCHEMA,
);
