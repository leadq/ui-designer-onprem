import { TextRenderer } from '@root/adapters/antd/renderers';
import { getBoolean } from '@root/adapters/antd/utils/getBoolean';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import { getSelect } from '@root/adapters/antd/utils/getSelect';
import { getText } from '@root/adapters/antd/utils/getText';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignTypographyMeta: ComponentMeta = getMeta(
  'typography',
  'Typography',
  'display',
  TextRenderer,
  'Typography',
  { children: 'Hello World' },
  [
    getText('children', 'Text', 'Hello World'),
    getSelect('type', 'Type', ['', 'secondary', 'success', 'warning', 'danger'], ''),
    getBoolean('strong', 'Strong'),
    getBoolean('italic', 'Italic'),
  ],
);

antDesignTypographyMeta.propsSchema = antDesignTypographyMeta.propsSchema.map((prop) =>
  ["type", "strong", "italic"].includes(prop.key) ? { ...prop, isResponsive: true } : prop,
);
