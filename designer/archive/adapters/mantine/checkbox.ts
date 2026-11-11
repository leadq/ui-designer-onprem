import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { CheckboxRenderer } from './renderers';

export const mantineCheckboxMeta: ComponentMeta = {
  type: 'checkbox',
  displayName: 'Checkbox',
  searchKeywords: ['onay', 'işaret', 'kutucuk', 'seçim'],
  category: 'form',
  isContainer: false,
  defaultProps: { label: 'Checkbox Label', defaultChecked: false },
  defaultStyle: {},
  propsSchema: [
    { key: 'label', label: 'Label', type: 'text', defaultValue: 'Checkbox Label' },
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
  ],
  renderer: CheckboxRenderer,
  exportConfig: getMantineExportConfig('Checkbox'),
};
