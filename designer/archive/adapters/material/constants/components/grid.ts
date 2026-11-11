import { GridRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialGridMeta: ComponentMeta = getMeta(
  'grid',
  'Grid',
  'layout',
  GridRenderer,
  'Grid',
  { spacing: 2 },
  [{ key: 'spacing', label: 'Spacing', type: 'number', defaultValue: 2 }],
  true,
);
