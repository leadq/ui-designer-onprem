import { SIZE } from '@root/adapters/antd/constants/schema';
import { ButtonRenderer } from '@root/adapters/antd/renderers';
import { getBoolean } from '@root/adapters/antd/utils/getBoolean';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import { getSelect } from '@root/adapters/antd/utils/getSelect';
import { getText } from '@root/adapters/antd/utils/getText';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignButtonMeta: ComponentMeta = getMeta(
  'button',
  'Button',
  'form',
  ButtonRenderer,
  'Button',
  { type: 'primary', children: 'Button' },
  [
    getText('children', 'Label', 'Button'),
    getSelect('type', 'Type', ['primary', 'default', 'dashed', 'link', 'text'], 'primary'),
    SIZE,
    getBoolean('disabled', 'Disabled'),
  ],
);

antDesignButtonMeta.propsSchema = antDesignButtonMeta.propsSchema.map((prop) =>
  ["type", "size"].includes(prop.key) ? { ...prop, isResponsive: true } : prop,
);
