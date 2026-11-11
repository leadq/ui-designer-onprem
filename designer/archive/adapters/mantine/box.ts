import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { BoxRenderer } from './renderers';

export const mantineBoxMeta: ComponentMeta = {
  type: 'box',
  displayName: 'Box',
  searchKeywords: ['kutu', 'alan', 'container', 'kapsayıcı'],
  category: 'layout',
  isContainer: true,
  defaultProps: {},
  defaultStyle: {
    minHeight: '100px',
    padding: '10px',
  },
  propsSchema: [],
  renderer: BoxRenderer,
  exportConfig: getMantineExportConfig('Box'),
};
