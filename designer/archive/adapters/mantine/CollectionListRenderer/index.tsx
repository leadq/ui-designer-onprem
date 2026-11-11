import type { CollectionEntry } from '@root/utils/collectionAuthoring/types';
import type { RendererProps } from '@root/types/componentContract';
import { List } from '@mantine/core';

export type CollectionListRendererProps = RendererProps;

export const CollectionListRenderer = ({ collectionEntries, renderMode: _renderMode, designItemId: _designItemId, rootClassName, rootRef, ...props }: CollectionListRendererProps) => (
  <List {...props} ref={rootRef} className={rootClassName} listStyleType="none" data-collection-root>
    {((collectionEntries ?? []) as CollectionEntry[]).map((entry) => <List.Item key={entry.id}>{entry.content}</List.Item>)}
  </List>
);
