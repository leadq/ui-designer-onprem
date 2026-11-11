import type { ComponentExportConfig } from '@root/types/componentContract';

const MATERIAL_TABS_HELPER = `import { useState as useDesignerTabsState, type ReactNode as DesignerTabContent } from 'react';
const DesignerMaterialTabs = ({ initial, items, orientation, ...props }: { initial: string; items: { id: string; label: string; disabled: boolean; content: DesignerTabContent }[]; orientation: 'horizontal' | 'vertical' } & Omit<React.ComponentProps<typeof Box>, 'children'>) => {
  const [value, setValue] = useDesignerTabsState(initial);
  return <Box {...props} sx={{ display: 'flex', flexDirection: orientation === 'vertical' ? 'row' : 'column' }}>
    <Tabs value={value || false} orientation={orientation} onChange={(_event, next: string) => setValue(next)}>
      {items.map(item => <Tab key={item.id} value={item.id} label={item.label} disabled={item.disabled} id={'tab-' + item.id} aria-controls={'panel-' + item.id} />)}
    </Tabs>
    {items.map(item => <Box key={item.id} role="tabpanel" hidden={item.id !== value} id={'panel-' + item.id} aria-labelledby={'tab-' + item.id}>{item.content}</Box>)}
  </Box>;
};`;

export const getCollectionExport = (
  adapter: 'mantine' | 'material' | 'antd',
  kind: 'list' | 'tabs',
): ComponentExportConfig => ({
  importPath: adapter === 'mantine' ? '@mantine/core' : adapter === 'material' ? '@mui/material' : 'antd',
  importName: kind === 'list' ? 'List' : 'Tabs',
  importType: 'named',
  additionalImports: adapter === 'material' ? kind === 'list' ? ['ListItem'] : ['Box', 'Tab'] : [],
  supportCode: adapter === 'material' && kind === 'tabs' ? MATERIAL_TABS_HELPER : undefined,
  renderCollectionJSX: (node, contents, attributes) => {
    const attrs = attributes.join(' ');

    if (kind === 'list') {
      if (adapter === 'antd') {
        if (!contents.length) { return `<List ${attrs} locale={{ emptyText: null }} dataSource={[]} />`; }
        return `<List ${attrs} locale={{ emptyText: null }} dataSource={[${contents.map((content, index) => `{ id: ${JSON.stringify(node.children[index].id)}, content: (${content}) }`).join(', ')}]} renderItem={(item) => <List.Item key={item.id}>{item.content}</List.Item>} />`;
      }

      const itemTag = adapter === 'mantine' ? 'List.Item' : 'ListItem';

      return `<List ${attrs} ${adapter === 'mantine' ? 'listStyleType="none"' : ''}>${contents.map((content, index) => `<${itemTag} key={${JSON.stringify(node.children[index].id)}} ${adapter === 'material' ? 'disablePadding' : ''}>${content}</${itemTag}>`).join('') || '{null}'}</List>`;
    }

    const initial = JSON.stringify(node.props.initialItemId);
    const orientation = JSON.stringify(node.props.orientation ?? 'horizontal');
    const items = node.children.map((item, index) => ({ item, content: contents[index] }));

    if (adapter === 'mantine') {
      return `<Tabs ${attrs} defaultValue={${initial || 'null'}} orientation={${orientation}}><Tabs.List>${items.map(({ item }) => `<Tabs.Tab value={${JSON.stringify(item.id)}} disabled={${Boolean(item.props.disabled)}}>{${JSON.stringify(item.props.label)}}</Tabs.Tab>`).join('') || '{null}'}</Tabs.List>${items.map(({ item, content }) => `<Tabs.Panel value={${JSON.stringify(item.id)}}>${content}</Tabs.Panel>`).join('')}</Tabs>`;
    }

    if (adapter === 'antd') {
      return `<Tabs ${attrs} defaultActiveKey={${initial}} tabPosition="${node.props.orientation === 'vertical' ? 'left' : 'top'}" items={[${items.map(({ item, content }) => `{ key: ${JSON.stringify(item.id)}, label: ${JSON.stringify(item.props.label)}, disabled: ${Boolean(item.props.disabled)}, forceRender: true, children: (${content}) }`).join(', ')}]} />`;
    }

    return `<DesignerMaterialTabs ${attrs} initial={${initial}} orientation={${orientation}} items={[${items.map(({ item, content }) => `{ id: ${JSON.stringify(item.id)}, label: ${JSON.stringify(item.props.label)}, disabled: ${Boolean(item.props.disabled)}, content: (${content}) }`).join(', ')}]} />`;
  },
});
