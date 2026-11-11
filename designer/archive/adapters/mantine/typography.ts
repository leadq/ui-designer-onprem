import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { TextRenderer } from './renderers';

export const mantineTypographyMeta: ComponentMeta = {
  type: 'typography',
  displayName: 'Typography',
  searchKeywords: ['metin', 'yazı', 'başlık', 'paragraf', 'text'],
  category: 'display',
  isContainer: false,
  defaultProps: { children: 'Hello World', size: 'md', fw: 400 },
  defaultStyle: {},
  propsSchema: [
    { key: 'children', label: 'Content', type: 'text', defaultValue: 'Hello World' },
    {
      key: 'size', isResponsive: true,
      label: 'Size',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    { key: 'fw', isResponsive: true, label: 'Weight', type: 'number', defaultValue: 400 },
    { key: 'c', isResponsive: true, label: 'Color', type: 'text', defaultValue: 'black' },
    {
      key: 'ta', isResponsive: true,
      label: 'Align',
      type: 'select',
      options: ['left', 'center', 'right', 'justify'],
      defaultValue: 'left',
    },
  ],
  renderer: TextRenderer,
  exportConfig: getMantineExportConfig('Text'),
};
