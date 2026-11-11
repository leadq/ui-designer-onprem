import { FIELD_DEFAULTS, FIELD_SCHEMA } from '@root/adapters/material/constants/schema';
import { NumberInputRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialNumberInputMeta: ComponentMeta = getMeta(
  'numberInput',
  'Number Input',
  'form',
  NumberInputRenderer,
  'TextField',
  { ...FIELD_DEFAULTS, label: 'Number Input' },
  FIELD_SCHEMA,
);
