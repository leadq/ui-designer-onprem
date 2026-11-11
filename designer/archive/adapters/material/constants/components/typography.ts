import { TextRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import { getSelect } from '@root/adapters/material/utils/getSelect';
import { getText } from '@root/adapters/material/utils/getText';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialTypographyMeta: ComponentMeta = getMeta(
  'typography',
  'Typography',
  'display',
  TextRenderer,
  'Typography',
  { children: 'Hello World', variant: 'body1' },
  [
    getText('children', 'Text', 'Hello World'),
    getSelect(
      'variant',
      'Variant',
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'subtitle1', 'subtitle2'],
      'body1',
    ),
    getSelect('align', 'Align', ['left', 'center', 'right', 'justify'], 'left'),
  ],
);

materialTypographyMeta.propsSchema = materialTypographyMeta.propsSchema.map((prop) =>
  ["variant", "align"].includes(prop.key) ? { ...prop, isResponsive: true } : prop,
);

materialTypographyMeta.propsSchema.push(getSelect('component', 'HTML element', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'], 'p'));
materialTypographyMeta.responsiveSemanticElement = {
  prop: 'component', variantProp: 'variant', fallback: 'span',
  mapping: { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6', subtitle1: 'h6', subtitle2: 'h6', body1: 'p', body2: 'p' },
};
