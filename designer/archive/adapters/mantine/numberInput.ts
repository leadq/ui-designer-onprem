import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { NumberInputRenderer } from './renderers';

export const mantineNumberInputMeta: ComponentMeta = {
  type: 'numberInput',
  displayName: 'Number Input',
  searchKeywords: ['sayı', 'numara', 'rakam', 'giriş'],
  category: 'form',
  isContainer: false,
  defaultProps: { label: 'Number Input', placeholder: 'Enter number' },
  defaultStyle: {},
  propsSchema: [
    { key: 'label', label: 'Label', type: 'text', defaultValue: 'Number Input' },
    { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Enter number' },
    { key: 'description', label: 'Description', type: 'text', defaultValue: '' },
    {
      key: 'variant',
      label: 'Variant',
      type: 'select',
      options: ['default', 'filled', 'unstyled'],
      defaultValue: 'default',
    },
    { key: 'min', label: 'Min', type: 'number', defaultValue: 0 },
    { key: 'max', label: 'Max', type: 'number', defaultValue: 100 },
    { key: 'step', label: 'Step', type: 'number', defaultValue: 1 },
    { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
    { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  ],
  renderer: NumberInputRenderer,
  exportConfig: getMantineExportConfig('NumberInput'),
};
