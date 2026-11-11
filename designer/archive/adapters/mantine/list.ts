import type { ComponentMeta } from '@root/types/componentContract';

import { ListRenderer } from './renderers';

export const mantineListMeta: ComponentMeta = {
  type: 'list',
  displayName: 'List',
  searchKeywords: ['liste', 'tekrarlı', 'kayıtlar', 'öğeler'],
  category: 'display',
  isContainer: false,
  defaultProps: {
    data: [
      { id: '1', title: 'First Item', description: 'This is description 1' },
      { id: '2', title: 'Second Item', description: 'This is description 2' },
    ],
  },
  defaultStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '16px',
    background: '#fff',
  },
  propsSchema: [
    {
      key: 'data',
      label: 'List Data',
      type: 'arrayOfObjects',
      itemSchema: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'text' },
      ],
      defaultValue: [
        { title: 'Item 1', description: 'Description 1' },
        { title: 'Item 2', description: 'Description 2' },
      ],
    },
    {
      key: 'renderItem',
      label: 'Item Template',
      type: 'slot',
      slotRenderMode: 'callback',
      slotDescription: 'Design for each list item. Add nested components here.',
      slotAcceptsMultiple: false,
      defaultValue: null,
    },
  ],
  renderer: ListRenderer,
  exportConfig: {
    importPath: '',
    importName: 'List',
    importType: 'none',
    agentPlaceholder: 'Replace this semantic list with the target project list or mapping pattern.',
  },
};
