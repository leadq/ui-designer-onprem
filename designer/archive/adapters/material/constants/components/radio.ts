import { TOGGLE_DEFAULTS, TOGGLE_SCHEMA } from '@root/adapters/material/constants/schema';
import { RadioRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import { getText } from '@root/adapters/material/utils/getText';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialRadioMeta: ComponentMeta = getMeta(
  'radio',
  'Radio',
  'form',
  RadioRenderer,
  'Radio',
  { ...TOGGLE_DEFAULTS, label: 'Radio Label', value: '1' },
  [...TOGGLE_SCHEMA, getText('value', 'Value', '1')],
);
