import { FIELDS } from '@root/adapters/antd/constants/schema';
import { TextareaRenderer } from '@root/adapters/antd/renderers';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignTextareaMeta: ComponentMeta = getMeta(
  'textarea',
  'Textarea',
  'form',
  TextareaRenderer,
  'Input',
  { label: 'Textarea Label', minRows: 2 },
  [...FIELDS, { key: 'minRows', label: 'Min rows', type: 'number', defaultValue: 2 }],
);
