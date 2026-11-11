import { getBoolean } from '@root/adapters/antd/utils/getBoolean';
import { getSelect } from '@root/adapters/antd/utils/getSelect';
import { getText } from '@root/adapters/antd/utils/getText';

export const SIZE = getSelect('size', 'Size', ['small', 'medium', 'large'], 'medium');

export const FIELDS = [
  getText('label', 'Label', 'Text Input'),
  getText('placeholder', 'Placeholder'),
  SIZE,
  getBoolean('disabled', 'Disabled'),
];

export const TOGGLES = [
  getText('label', 'Label'),
  getBoolean('defaultChecked', 'Checked'),
  getBoolean('disabled', 'Disabled'),
];
