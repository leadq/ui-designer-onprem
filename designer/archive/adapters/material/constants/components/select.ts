import { FIELD_DEFAULTS, FIELD_SCHEMA } from '@root/adapters/material/constants/schema';
import { SelectRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialSelectMeta: ComponentMeta = getMeta(
  'select',
  'Select',
  'form',
  SelectRenderer,
  'TextField',
  {
    ...FIELD_DEFAULTS,
    label: 'Select Label',
    data: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  },
  [
    ...FIELD_SCHEMA,
    {
      key: 'data',
      label: 'Options',
      type: 'arrayOfObjects',
      defaultValue: [],
      itemSchema: [
        { key: 'value', label: 'Value', type: 'text', required: true },
        { key: 'label', label: 'Label', type: 'text', required: true },
        { key: 'disabled', label: 'Disabled', type: 'boolean' },
      ],
    },
  ],
);
