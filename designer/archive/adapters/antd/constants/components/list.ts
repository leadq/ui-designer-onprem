import { ListRenderer } from '@root/adapters/antd/ListRenderer';
import { getMeta } from '@root/adapters/antd/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const antDesignListMeta: ComponentMeta = getMeta(
  'list',
  'List',
  'display',
  ListRenderer,
  'List',
  { data: [{ title: 'First Item' }, { title: 'Second Item' }] },
  [
    {
      key: 'data',
      label: 'List Data',
      type: 'arrayOfObjects',
      defaultValue: [],
      itemSchema: [{ key: 'title', label: 'Title', type: 'text' }],
    },
    {
      key: 'renderItem',
      label: 'Item Template',
      type: 'slot',
      slotRenderMode: 'callback',
      slotAcceptsMultiple: false,
      defaultValue: null,
    },
  ],
);
