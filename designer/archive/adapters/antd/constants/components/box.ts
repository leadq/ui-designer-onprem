import { BoxRenderer } from '@root/adapters/antd/renderers';
import { getBoolean } from '@root/adapters/antd/utils/getBoolean';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignBoxMeta: ComponentMeta = getMeta(
  'box',
  'Box',
  'layout',
  BoxRenderer,
  'Flex',
  { vertical: true },
  [getBoolean('vertical', 'Vertical', true)],
  true,
);
