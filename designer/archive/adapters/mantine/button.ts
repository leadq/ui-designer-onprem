import { DEFAULT_THEME } from '@mantine/core';

import type { ComponentMeta } from '@root/types/componentContract';

import { getMantineExportConfig } from './exportConfig';
import { ButtonRenderer } from './renderers';

export const mantineButtonMeta: ComponentMeta = {
  type: 'button',
  displayName: 'Button',
  searchKeywords: ['buton', 'düğme', 'aksiyon', 'action', 'submit'],
  category: 'display',
  isContainer: false,
  defaultProps: { variant: 'filled', children: 'Button' },
  defaultStyle: {},
  propsSchema: [
    { key: 'children', label: 'Label', type: 'text', defaultValue: 'Button' },
    {
      key: 'variant', isResponsive: true,
      label: 'Variant',
      type: 'select',
      options: ['filled', 'outline', 'light', 'subtle', 'default'],
      defaultValue: 'filled',
    },
    {
      key: 'size', isResponsive: true,
      label: 'Size',
      type: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    {
      key: 'color', isResponsive: true, label: 'Color', type: 'select', defaultValue: 'blue',
      options: [
        ...Object.keys(DEFAULT_THEME.colors),
        ...Object.keys(DEFAULT_THEME.colors).flatMap((color) =>
          DEFAULT_THEME.colors[color].map((_, shade) => `${color}.${shade}`)),
      ],
    },
  ],
  renderer: ButtonRenderer,
  exportConfig: getMantineExportConfig('Button'),
};
