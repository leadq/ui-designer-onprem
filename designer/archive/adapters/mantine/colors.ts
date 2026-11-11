import { DEFAULT_THEME } from '@mantine/core';
import type { ColorToken } from '@root/utils/colorTokens/types';

export const mantineColors: ColorToken[] = Object.entries(DEFAULT_THEME.colors).flatMap(([name, shades]) =>
  shades.map((value, index) => ({
    id: `${name}.${index}`, label: `${name}.${index}`, group: name,
    cssValue: value, usages: ['backgroundColor', 'color', 'borderColor'],
  })),
);
