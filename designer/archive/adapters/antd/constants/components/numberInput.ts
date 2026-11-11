import { FIELDS } from '@root/adapters/antd/constants/schema';
import { NumberInputRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignNumberInputMeta: ComponentMeta = getMeta(
  'numberInput',
  'InputNumber',
  'form',
  NumberInputRenderer,
  'InputNumber',
  { label: 'Number Input' },
  FIELDS,
);
