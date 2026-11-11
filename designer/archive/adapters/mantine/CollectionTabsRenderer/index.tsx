import type { RendererProps } from '@root/types/componentContract';
import { Tabs } from '@mantine/core';

import { useCollectionTabs } from '../../shared/collections/hooks/useCollectionTabs';

export type CollectionTabsRendererProps = RendererProps;

export const CollectionTabsRenderer = (props: CollectionTabsRendererProps) => {
  const { entries, value, handleChange } = useCollectionTabs(props);
  const { collectionEntries: _entries, initialItemId: _initial, designItemId: _design, renderMode: _mode, rootClassName, rootRef, orientation, onChange: _change, ...rest } = props;

  return (
    <Tabs {...rest} ref={rootRef} className={rootClassName} data-collection-root
      orientation={orientation as 'horizontal' | 'vertical'} value={value || null} onTabChange={handleChange}>
      <Tabs.List>
        {entries.map((entry) => <Tabs.Tab key={entry.id} data-collection-trigger={entry.id} value={entry.id} disabled={Boolean(entry.props.disabled)}>{String(entry.props.label)}</Tabs.Tab>)}
      </Tabs.List>
      {entries.map((entry) => <Tabs.Panel key={entry.id} value={entry.id}>{entry.content}</Tabs.Panel>)}
    </Tabs>
  );
};
