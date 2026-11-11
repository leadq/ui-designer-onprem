import { BoxRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialBoxMeta: ComponentMeta = getMeta(
  'box',
  'Box',
  'layout',
  BoxRenderer,
  'Box',
  {},
  [],
  true,
);
