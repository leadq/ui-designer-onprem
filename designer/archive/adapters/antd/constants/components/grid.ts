import { GridRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignGridMeta: ComponentMeta = getMeta(
  'grid',
  'Grid',
  'layout',
  GridRenderer,
  'Row',
  { gutter: 16 },
  [{ key: 'gutter', label: 'Gutter', type: 'number', defaultValue: 16 }],
  true,
);
