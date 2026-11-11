import type { RendererProps } from '@root/types/componentContract';
import { Tabs } from 'antd';

import { useCollectionTabs } from '../../shared/collections/hooks/useCollectionTabs';

export type CollectionTabsRendererProps = RendererProps;

export const CollectionTabsRenderer = (props: CollectionTabsRendererProps) => {
  const { entries, value, handleChange } = useCollectionTabs(props);
  const { collectionEntries: _entries, initialItemId: _initial, designItemId: _design, renderMode: _mode, rootClassName, rootRef, orientation, onChange: _change, ...rest } = props;

  return (
    <Tabs {...rest} ref={(instance) => rootRef?.(instance?.nativeElement ?? null)} className={rootClassName} data-collection-root
      tabPosition={orientation === 'vertical' ? 'left' : 'top'} activeKey={value} onChange={handleChange}
      items={entries.map((entry) => ({ key: entry.id, label: <span data-collection-trigger={entry.id}>{String(entry.props.label)}</span>, disabled: Boolean(entry.props.disabled), children: entry.content, forceRender: true }))}
    />
  );
};
