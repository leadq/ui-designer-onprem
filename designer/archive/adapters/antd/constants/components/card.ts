import { CardRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import { getSelect } from '@root/adapters/antd/utils/getSelect';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignCardMeta: ComponentMeta = getMeta(
  'card',
  'Card',
  'layout',
  CardRenderer,
  'Card',
  { variant: 'outlined' },
  [getSelect('variant', 'Variant', ['outlined', 'borderless'], 'outlined')],
  true,
);
