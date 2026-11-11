import type { RendererProps } from '@root/types/componentContract';
import { Box, Tab, Tabs } from '@mui/material';

import { useCollectionTabs } from '../../shared/collections/hooks/useCollectionTabs';

export type CollectionTabsRendererProps = RendererProps;

export const CollectionTabsRenderer = (props: CollectionTabsRendererProps) => {
  const { entries, value, handleChange } = useCollectionTabs(props);
  const { collectionEntries: _entries, initialItemId: _initial, designItemId: _design, renderMode: _mode, rootClassName, rootRef, orientation, onChange: _change, ...rest } = props;
  const id = String(props['data-node-id'] ?? 'tabs');

  return (
    <Box {...rest} ref={rootRef} className={rootClassName} data-collection-root sx={{ display: 'flex', flexDirection: orientation === 'vertical' ? 'row' : 'column' }}>
      <Tabs orientation={orientation as 'horizontal' | 'vertical'} value={value || false} onChange={(_event, next: string) => handleChange(next)}>
        {entries.map((entry) => <Tab key={entry.id} id={`${id}-tab-${entry.id}`} aria-controls={`${id}-panel-${entry.id}`} data-collection-trigger={entry.id} value={entry.id} label={String(entry.props.label)} disabled={Boolean(entry.props.disabled)} />)}
      </Tabs>
      {entries.map((entry) => <Box key={entry.id} role="tabpanel" id={`${id}-panel-${entry.id}`} aria-labelledby={`${id}-tab-${entry.id}`} hidden={entry.id !== value}>{entry.content}</Box>)}
    </Box>
  );
};
