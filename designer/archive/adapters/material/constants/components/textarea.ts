import { FIELD_DEFAULTS, FIELD_SCHEMA } from '@root/adapters/material/constants/schema';
import { TextareaRenderer } from '@root/adapters/material/renderers';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialTextareaMeta: ComponentMeta = getMeta(
  'textarea',
  'Textarea',
  'form',
  TextareaRenderer,
  'TextField',
  { ...FIELD_DEFAULTS, label: 'Textarea Label', minRows: 2 },
  [...FIELD_SCHEMA, { key: 'minRows', label: 'Min rows', type: 'number', defaultValue: 2 }],
);
