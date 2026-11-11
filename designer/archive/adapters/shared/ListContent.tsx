import type { ReactNode } from 'react';

import { Box } from '@root/components/common/Box';
import { getDataRows } from '@root/utils/getDataRows';

interface ListContentProps {
  data: unknown;
  renderItem: unknown;
  renderMode: unknown;
}

export const ListContent = ({ data, renderItem, renderMode }: ListContentProps) => {
  if (typeof renderItem !== 'function') {
    return <>{renderItem as ReactNode}</>;
  }

  const render = renderItem as (item: Record<string, unknown> | null) => ReactNode;
  const items = getDataRows(data);
  const keyCounts = new Map<string, number>();

  return <>{renderMode === 'preview'
    ? items.map((item, index) => {
        const key =
          item.id === null || item.id === undefined ? `index:${index}` : `id:${String(item.id)}`;

        const occurrence = keyCounts.get(key) ?? 0;

        keyCounts.set(key, occurrence + 1);

        return <Box key={`${key}:${occurrence}`}>{render(item)}</Box>;
      })
    : render(null)}</>;
};
