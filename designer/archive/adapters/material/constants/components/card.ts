import { CardRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import { getSelect } from '@root/adapters/material/utils/getSelect';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialCardMeta: ComponentMeta = getMeta(
  'card',
  'Card',
  'layout',
  CardRenderer,
  'Card',
  { variant: 'outlined' },
  [
    getSelect('variant', 'Variant', ['outlined', 'elevation'], 'outlined'),
    { key: 'elevation', label: 'Elevation', type: 'number', defaultValue: 1 },
  ],
  true,
);
