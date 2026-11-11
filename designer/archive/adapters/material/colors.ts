import type { ColorToken } from '@root/utils/colorTokens/types';
import { materialTheme } from './theme';

export const materialColors: ColorToken[] = [
  ...(['primary', 'secondary', 'success', 'error', 'info', 'warning'] as const).flatMap(name =>
    (['light', 'main', 'dark', 'contrastText'] as const).map(shade => ({
      id: `${name}.${shade}`, label: `${name}.${shade}`, group: name,
      cssValue: materialTheme.palette[name][shade], usages: ['backgroundColor', 'color', 'borderColor'] as ColorToken['usages'],
    }))),
  ...(['background', 'text'] as const).flatMap(name => Object.entries(materialTheme.palette[name]).map(([key,value])=>({
    id: `${name}.${key}`, label: `${name}.${key}`, group: name, cssValue: value,
    usages: ['backgroundColor','color','borderColor'] as ColorToken['usages'],
  }))),
];
