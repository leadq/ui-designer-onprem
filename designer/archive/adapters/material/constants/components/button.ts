import { COLORS } from '@root/adapters/material/constants/schema';
import { ButtonRenderer } from '@root/adapters/material/renderers';
import { getBoolean } from '@root/adapters/material/utils/getBoolean';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import { getSelect } from '@root/adapters/material/utils/getSelect';
import { getText } from '@root/adapters/material/utils/getText';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialButtonMeta: ComponentMeta = getMeta(
  'button',
  'Button',
  'form',
  ButtonRenderer,
  'Button',
  { variant: 'contained', children: 'Button' },
  [
    getText('children', 'Label', 'Button'),
    getSelect('variant', 'Variant', ['contained', 'outlined', 'text'], 'contained'),
    getSelect('size', 'Size', ['small', 'medium', 'large'], 'medium'),
    getSelect('color', 'Color', COLORS, 'primary'),
    getBoolean('disabled', 'Disabled'),
  ],
);

materialButtonMeta.propsSchema = materialButtonMeta.propsSchema.map((prop) =>
  ["size", "variant", "color"].includes(prop.key) ? { ...prop, isResponsive: true } : prop,
);
