import { TOGGLE_DEFAULTS, TOGGLE_SCHEMA } from '@root/adapters/material/constants/schema';
import { SwitchRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialSwitchMeta: ComponentMeta = getMeta(
  'switch',
  'Switch',
  'form',
  SwitchRenderer,
  'Switch',
  { ...TOGGLE_DEFAULTS, label: 'Switch Label' },
  TOGGLE_SCHEMA,
);
