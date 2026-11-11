import type { ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';
import { getDataRows } from '@root/utils/getDataRows';
import { List } from 'antd';

export type ListRendererProps = RendererProps;

export const ListRenderer = ({
  rootClassName,
  rootRef,
  renderMode,
  data,
  renderItem,
  ...props
}: ListRendererProps) => {
  const rows = getDataRows(data);

  const render =
    typeof renderItem === 'function'
      ? (renderItem as (item: Record<string, unknown> | null) => ReactNode)
      : null;

  return (
    <List
      {...props}
      ref={rootRef}
      className={rootClassName}
      data-item-count={rows.length}
      dataSource={renderMode === 'preview' ? rows : []}
      locale={{ emptyText: null }}
      renderItem={(item) => <List.Item>{render?.(item)}</List.Item>}
    >
      {renderMode === 'preview' ? null : render?.(null)}
    </List>
  );
};
