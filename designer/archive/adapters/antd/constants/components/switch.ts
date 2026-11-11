import { TOGGLES } from '@root/adapters/antd/constants/schema';
import { SwitchRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignSwitchMeta: ComponentMeta = getMeta(
  'switch',
  'Switch',
  'form',
  SwitchRenderer,
  'Switch',
  { label: 'Switch Label', defaultChecked: false },
  TOGGLES,
);
