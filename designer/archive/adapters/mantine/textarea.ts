import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { TextareaRenderer } from './renderers';

export const mantineTextareaMeta: ComponentMeta = {
  type: 'textarea',
  displayName: 'Textarea',
  searchKeywords: ['uzun metin', 'açıklama', 'çok satır', 'metin alanı'],
  category: 'form',
  isContainer: false,
  defaultProps: { label: 'Textarea Label', placeholder: 'Enter long text...' },
  defaultStyle: {},
  propsSchema: [
    { key: 'label', label: 'Label', type: 'text', defaultValue: 'Textarea Label' },
    { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Enter long text...' },
    { key: 'description', label: 'Description', type: 'text', defaultValue: '' },
    {
      key: 'variant',
      label: 'Variant',
      type: 'select',
      options: ['default', 'filled', 'unstyled'],
      defaultValue: 'default',
    },
    { key: 'autosize', label: 'Autosize', type: 'boolean', defaultValue: false },
    { key: 'minRows', label: 'Min Rows', type: 'number', defaultValue: 2 },
    { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
    { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  ],
  renderer: TextareaRenderer,
  exportConfig: getMantineExportConfig('Textarea'),
};
