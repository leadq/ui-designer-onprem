import type { RendererProps } from '@root/types/componentContract';

import { ListContent } from '../shared/ListContent';

export type ListRendererProps = RendererProps;

export const ListRenderer = ({
  rootRef,
  rootClassName,
  'data-node-id': nodeId,
  data,
  renderItem,
  renderMode,
  ...props
}: ListRendererProps) => {
  const items = Array.isArray(data) ? data : [];

  return (
    <div
      ref={rootRef}
      {...props}
      className={rootClassName}
      data-item-count={items.length}
      data-node-id={nodeId}
    >
      <ListContent data={data} renderItem={renderItem} renderMode={renderMode} />
    </div>
  );
};
