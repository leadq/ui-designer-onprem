import { FIELD_DEFAULTS, FIELD_SCHEMA } from '@root/adapters/material/constants/schema';
import { TextInputRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialTextInputMeta: ComponentMeta = getMeta(
  'textInput',
  'TextField',
  'form',
  TextInputRenderer,
  'TextField',
  { ...FIELD_DEFAULTS, label: 'Text Input', placeholder: 'Enter text...' },
  FIELD_SCHEMA,
);
