import { useState } from 'react';

import type { CollectionEntry } from '@root/utils/collectionAuthoring/types';
import type { RendererProps } from '@root/types/componentContract';

export const useCollectionTabs = (props: RendererProps) => {
  const entries = (props.collectionEntries ?? []) as CollectionEntry[];
  const initial = String(props.initialItemId ?? entries[0]?.id ?? '');
  const [active, setActive] = useState(initial);
  const selected = props.renderMode === 'design' ? String(props.designItemId ?? initial) : active;
  const value = entries.some((item) => item.id === selected) ? selected : initial;

  const handleChange = (next: string | null) => {
    if (props.renderMode === 'design' || !next || next === value || entries.find((item) => item.id === next)?.props.disabled) {
      return;
    }

    setActive(next);

    if (typeof props.onChange === 'function') {
      props.onChange(next);
    }
  };

  return { entries, value, handleChange };
};
