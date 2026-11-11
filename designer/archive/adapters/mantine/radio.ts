import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { RadioRenderer } from './renderers';

export const mantineRadioMeta: ComponentMeta = {
  type: 'radio',
  displayName: 'Radio',
  searchKeywords: ['tek seçim', 'seçenek', 'işaret'],
  category: 'form',
  isContainer: false,
  defaultProps: { label: 'Radio Label', value: '1' },
  defaultStyle: {},
  propsSchema: [
    { key: 'label', label: 'Label', type: 'text', defaultValue: 'Radio Label' },
    { key: 'description', label: 'Description', type: 'text', defaultValue: '' },
    {
      key: 'variant',
      label: 'Variant',
      type: 'select',
      options: ['default', 'outline'],
      defaultValue: 'default',
    },
    {
      key: 'size',
      label: 'Size',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'sm',
    },
    { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    { key: 'color', label: 'Color', type: 'text', defaultValue: 'blue' },
    { key: 'value', label: 'Value', type: 'text', defaultValue: '1' },
  ],
  renderer: RadioRenderer,
  exportConfig: getMantineExportConfig('Radio'),
};
