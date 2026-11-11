import type { ComponentType } from 'react';

import { createNode } from '@root/utils/nodes';
import type { ComponentMeta, Registry, RendererProps } from '@root/types/componentContract';

import { getCollectionExport } from './getCollectionExport';

export const getCollectionRegistry = (
  adapter: 'mantine' | 'material' | 'antd',
  box: ComponentMeta,
  listRenderer: ComponentType<RendererProps>,
  tabsRenderer: ComponentType<RendererProps>,
): Registry => ({
  itemList: {
    type: 'itemList', displayName: 'Item List', category: 'display', isContainer: false,
    searchKeywords: ['liste', 'öğe', 'renderItem', 'doğrudan'],
    collection: { kind: 'list', itemType: 'listItem' },
    defaultProps: {}, defaultStyle: { width: 480, maxWidth: '100%' }, propsSchema: [],
    renderer: listRenderer,
    exportConfig: getCollectionExport(adapter, 'list'),
  },
  listItem: {
    ...box, type: 'listItem', displayName: 'List item', collectionItem: 'list',
    defaultProps: {}, propsSchema: [], defaultStyle: { display: 'flex', flexDirection: 'column', gap: 8, padding: 12 },
    showEmptyPlaceholder: true,
  },
  tabs: {
    type: 'tabs', displayName: 'Tabs', category: 'layout', isContainer: false,
    searchKeywords: ['sekme', 'compound', 'panel'],
    collection: { kind: 'tabs', itemType: 'tabItem' },
    defaultProps: { initialItemId: '', orientation: 'horizontal' },
    defaultStyle: { width: 480, maxWidth: '100%' },
    propsSchema: [{ key: 'orientation', label: 'Orientation', type: 'select', defaultValue: 'horizontal', options: ['horizontal', 'vertical'] }],
    initializeNode: (node, registry) => {
      const children = [1, 2].map((number) => ({
        ...createNode(registry, 'tabItem'), props: { label: `Tab ${number}`, disabled: false },
      }));

      return { ...node, children, props: { ...node.props, initialItemId: children[0].id } };
    },
    renderer: tabsRenderer,
    exportConfig: getCollectionExport(adapter, 'tabs'),
  },
  tabItem: {
    ...box, type: 'tabItem', displayName: 'Tab', collectionItem: 'tabs',
    defaultProps: { label: 'Tab', disabled: false },
    defaultStyle: { display: 'flex', flexDirection: 'column', gap: 12, padding: 16 },
    propsSchema: [
      { key: 'label', label: 'Tab title', type: 'text', defaultValue: 'Tab' },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    ],
    showEmptyPlaceholder: true,
    // The collection maps title/disabled to the native trigger; the content root remains a Box.
    exportConfig: { ...box.exportConfig, renderJSX: (_node, attrs, content) =>
      `<${box.exportConfig.jsxName ?? box.exportConfig.importName} ${attrs.filter((attr) => !/^(label|disabled)=/.test(attr)).join(' ')}>${content}</${box.exportConfig.jsxName ?? box.exportConfig.importName}>` },
  },
});
