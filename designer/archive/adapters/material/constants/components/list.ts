import { ListRenderer } from '@root/adapters/material/ListRenderer';
import { getMeta } from '@root/adapters/material/utils/getMeta';
import type { ComponentMeta } from '@root/types/componentContract';

export const materialListMeta: ComponentMeta = {
  ...getMeta(
    'list',
    'List',
    'display',
    ListRenderer,
    'Box',
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
        defaultValue: null,
      },
    ],
  ),
  exportConfig: {
    importPath: '',
    importName: 'List',
    importType: 'none',
    agentPlaceholder: 'Implement item mapping with this saved item template in the target project.',
  },
};
