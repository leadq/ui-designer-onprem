import { TOGGLES } from '@root/adapters/antd/constants/schema';
import { RadioRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import { getText } from '@root/adapters/antd/utils/getText';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignRadioMeta: ComponentMeta = getMeta(
  'radio',
  'Radio',
  'form',
  RadioRenderer,
  'Radio',
  { label: 'Radio Label', defaultChecked: false, value: '1' },
  [...TOGGLES, getText('value', 'Value', '1')],
);
