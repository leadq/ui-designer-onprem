import { TOGGLES } from '@root/adapters/antd/constants/schema';
import { CheckboxRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignCheckboxMeta: ComponentMeta = getMeta(
  'checkbox',
  'Checkbox',
  'form',
  CheckboxRenderer,
  'Checkbox',
  { label: 'Checkbox Label', defaultChecked: false },
  TOGGLES,
);
