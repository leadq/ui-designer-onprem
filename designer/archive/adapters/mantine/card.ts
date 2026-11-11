import { DEFAULT_THEME } from '@mantine/core';

import type { ComponentMeta } from '@root/types/componentContract';

import { titleInContentRecipe } from './recipes/card/title-in-content/recipe';
import { getMantineExportConfig } from './exportConfig';
import { CardRenderer } from './renderers';

export const mantineCardMeta: ComponentMeta = {
  type: 'card',
  displayName: 'Card',
  searchKeywords: ['kart', 'panel', 'container', 'kapsayıcı'],
  description: 'İçeriği gruplamak için native kart kapsayıcısı.',
  visualHints: ['Başlık ve içerik bir kart içinde bulunabilir; ayrı header bölgesi görünümden kesinleşmez.'],
  recipes: [titleInContentRecipe],
  category: 'layout',
  isContainer: true,
  defaultProps: { shadow: 'sm', padding: 'lg', radius: 'md', withBorder: true },
  defaultStyle: { minHeight: '100px', display: 'flex', flexDirection: 'column' },
  getDefaultLayoutStyle: (props) => ({
    padding: `${Number.parseFloat(DEFAULT_THEME.spacing[String(props.padding ?? 'lg')] ?? DEFAULT_THEME.spacing.lg) * 16}px`,
  }),
  propsSchema: [
    {
      key: 'shadow',
      label: 'Shadow',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'sm',
    },
    {
      key: 'padding',
      label: 'Padding',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'lg',
    },
    {
      key: 'radius',
      label: 'Radius',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    { key: 'withBorder', label: 'With Border', type: 'boolean', defaultValue: true },
  ],
  renderer: CardRenderer,
  exportConfig: {
    ...getMantineExportConfig('Card'),
    renderJSX: (_node, props, children) => `<Card ${props.join(' ')}>${children || '{null}'}</Card>`,
  },
};
