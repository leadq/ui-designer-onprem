import { FIELDS } from '@root/adapters/antd/constants/schema';
import { TextInputRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignTextInputMeta: ComponentMeta = getMeta(
  'textInput',
  'Input',
  'form',
  TextInputRenderer,
  'Input',
  { label: 'Text Input', placeholder: 'Enter text...' },
  FIELDS,
);
