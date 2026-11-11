import { useState } from 'react';

import type { RendererProps } from '@root/types/componentContract';

export const useDisclosureState = (props: RendererProps) => {
  const [isOpen, setOpen] = useState(Boolean(props.defaultExpanded ?? true));
  const isDesign = props.renderMode === 'design';
  const isExpanded = isDesign
    ? Boolean(props.designExpanded ?? true)
    : typeof props.expanded === 'boolean' ? props.expanded : isOpen;

  const handleChange = (next: boolean) => {
    if (isDesign || props.disabled || next === isExpanded) {
      return;
    }

    setOpen(next);

    if (typeof props.onChange === 'function') {
      props.onChange(next);
    }
  };

  return { isExpanded, handleChange };
};
