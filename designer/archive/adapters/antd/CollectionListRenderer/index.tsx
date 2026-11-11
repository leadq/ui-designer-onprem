import type { CollectionEntry } from '@root/utils/collectionAuthoring/types';
import type { RendererProps } from '@root/types/componentContract';
import { List } from 'antd';

export type CollectionListRendererProps = RendererProps;

export const CollectionListRenderer = ({ collectionEntries, renderMode: _renderMode, designItemId: _designItemId, rootClassName, rootRef, ...props }: CollectionListRendererProps) => (
  <List {...props} ref={rootRef} className={rootClassName} data-collection-root
    dataSource={(collectionEntries ?? []) as CollectionEntry[]} locale={{ emptyText: null }}
    renderItem={(entry) => <List.Item key={entry.id}>{entry.content}</List.Item>}
  />
);
