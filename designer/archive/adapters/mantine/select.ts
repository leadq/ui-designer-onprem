import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { SelectRenderer } from './renderers';
import { getSelectJSX } from './selectExport';

export const mantineSelectMeta: ComponentMeta = {
  type: 'select',
  displayName: 'Select',
  searchKeywords: ['seçim', 'seçenek', 'açılır liste', 'dropdown'],
  category: 'form',
  isContainer: false,
  defaultProps: {
    label: 'Select Label',
    placeholder: 'Pick one',
    data: [
      { value: 'react', label: 'React' },
      { value: 'ng', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'vue', label: 'Vue' },
    ],
  },
  defaultStyle: {},
  propsSchema: [
    { key: 'label', label: 'Label', type: 'text', defaultValue: 'Select Label' },
    { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Pick one' },
    {
      key: 'data',
      label: 'Options',
      type: 'arrayOfObjects',
      itemSchema: [
        { key: 'value', label: 'Value', type: 'text', required: true },
        { key: 'label', label: 'Label', type: 'text', required: true },
        { key: 'disabled', label: 'Disabled', type: 'boolean' },
      ],
      defaultValue: [
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'vue', label: 'Vue' },
      ],
    },
    { key: 'description', label: 'Description', type: 'text', defaultValue: '' },
    {
      key: 'variant',
      label: 'Variant',
      type: 'select',
      options: ['default', 'filled', 'unstyled'],
      defaultValue: 'default',
    },
    { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
    { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    { key: 'searchable', label: 'Searchable', type: 'boolean', defaultValue: false },
    { key: 'clearable', label: 'Clearable', type: 'boolean', defaultValue: false },
  ],
  renderer: SelectRenderer,
  exportConfig: { ...getMantineExportConfig('Select'), renderJSX: getSelectJSX },
};
