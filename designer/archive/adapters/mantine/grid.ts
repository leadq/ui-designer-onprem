import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { GridRenderer } from './renderers';

export const mantineGridMeta: ComponentMeta = {
  type: 'grid',
  displayName: 'Grid',
  searchKeywords: ['ızgara', 'kolon', 'sütun', 'satır', 'layout'],
  category: 'layout',
  isContainer: true,
  defaultProps: { gutter: 'md' },
  defaultStyle: {
    minHeight: '100px',
    padding: '10px',
  },
  propsSchema: [
    {
      key: 'gutter',
      label: 'Gutter',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    { key: 'grow', label: 'Grow', type: 'boolean', defaultValue: false },
  ],
  renderer: GridRenderer,
  exportConfig: {
    ...getMantineExportConfig('Grid'),
    wrapChild: (jsx) => `<Grid.Col span={6}>${jsx}</Grid.Col>`,
  },
};
