import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { SwitchRenderer } from './renderers';

export const mantineSwitchMeta: ComponentMeta = {
  type: 'switch',
  displayName: 'Switch',
  searchKeywords: ['anahtar', 'aç kapa', 'toggle'],
  category: 'form',
  isContainer: false,
  defaultProps: { label: 'Switch Label', defaultChecked: false },
  defaultStyle: {},
  propsSchema: [
    { key: 'label', label: 'Label', type: 'text', defaultValue: 'Switch Label' },
    { key: 'description', label: 'Description', type: 'text', defaultValue: '' },
    { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    { key: 'color', label: 'Color', type: 'text', defaultValue: 'blue' },
    {
      key: 'size',
      label: 'Size',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'sm',
    },
  ],
  renderer: SwitchRenderer,
  exportConfig: getMantineExportConfig('Switch'),
};
