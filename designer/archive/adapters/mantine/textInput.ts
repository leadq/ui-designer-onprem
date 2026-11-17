import type { ComponentMeta } from '@root/types/componentContract';

import { labelDescriptionRecipe } from './recipes/textInput/label-description/recipe';
import { getMantineExportConfig } from './exportConfig';
import { TextInputRenderer } from './renderers';

export const mantineTextInputMeta: ComponentMeta = {
  type: 'textInput',
  displayName: 'Text Input',
  searchKeywords: ['metin', 'yazı', 'giriş', 'alan', 'input'],
  description: 'Tek satırlı metin alanı; kendi label ve description metnini birlikte sunar.',
  visualHints: ['Farklı alan adları ve yardım metinleri giriş kutularıyla aynı hizada tekrarlanabilir.'],
  recipes: [labelDescriptionRecipe],
  category: 'form',
  isContainer: false,
  defaultProps: { label: 'Input Label', placeholder: 'Enter text...' },
  defaultStyle: {},
  propsSchema: [
    {
      key: 'label', label: 'Label', type: 'text', defaultValue: 'Input Label',
      description: 'Bu giriş kutusunu adlandıran görünür etiket.',
    },
    { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Enter text...' },
    {
      key: 'description', label: 'Description', type: 'text', defaultValue: '',
      description: 'Bu alana ait görünür yardım metni. Boş metin verildiğinde açıklama gösterilmez.',
    },
    {
      key: 'variant',
      label: 'Variant',
      type: 'select',
      options: ['default', 'filled', 'unstyled'],
      defaultValue: 'default',
    },
    { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
    { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  ],
  renderer: TextInputRenderer,
  exportConfig: getMantineExportConfig('TextInput'),
};
