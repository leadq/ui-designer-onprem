import { theme } from 'antd';
import type { ColorToken } from '@root/utils/colorTokens/types';
import { antDesignTheme } from './theme';

const tokens = theme.getDesignToken(antDesignTheme);
export const antDesignColors: ColorToken[] = [
  ['Brand', ['colorPrimary', 'colorPrimaryHover', 'colorPrimaryActive']],
  ['Text', ['colorText', 'colorTextSecondary', 'colorTextDisabled']],
  ['Surface', ['colorBgContainer', 'colorBgLayout', 'colorBgElevated']],
  ['Status', ['colorSuccess', 'colorError', 'colorWarning', 'colorInfo']],
  ['Border', ['colorBorder', 'colorBorderSecondary']],
].flatMap(([group, keys]) => (keys as string[]).map(id => ({
  id, label:id, group:group as string, cssValue:String(tokens[id as keyof typeof tokens]),
  usages:['backgroundColor','color','borderColor'],
})));
