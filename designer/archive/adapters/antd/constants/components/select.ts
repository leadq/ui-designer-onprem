import { FIELDS } from '@root/adapters/antd/constants/schema';
import { SelectRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignSelectMeta: ComponentMeta = getMeta(
  'select',
  'Select',
  'form',
  SelectRenderer,
  'Select',
  {
    label: 'Select Label',
    data: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  },
  [
    ...FIELDS,
    {
      key: 'data',
      label: 'Options',
      type: 'arrayOfObjects',
      defaultValue: [],
      itemSchema: [
        { key: 'value', label: 'Value', type: 'text' },
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'disabled', label: 'Disabled', type: 'boolean' },
      ],
    },
  ],
);
