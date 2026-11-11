import type { ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';
import { Collapse } from 'antd';

import { useDisclosureState } from '@root/adapters/shared/disclosure/hooks/useDisclosureState';

export type AccordionRendererProps = RendererProps;

export const AccordionRenderer = (props: AccordionRendererProps) => {
  const { isExpanded, handleChange } = useDisclosureState(props);
  const { renderMode: _mode, designExpanded: _design, expanded: _expanded, defaultExpanded: _initial,
    onChange: _change, rootRef, rootClassName, title, disabled, children, ...rest } = props;

  return (
    <Collapse {...rest} ref={rootRef} className={rootClassName}
      activeKey={isExpanded ? ['details'] : []} onChange={(keys) => handleChange(keys.includes('details'))}
      items={[{ key: 'details', label: <span data-disclosure-trigger={props['data-node-id']}>{title as ReactNode}</span>, collapsible: disabled ? 'disabled' : undefined,
        forceRender: true, children: children as ReactNode }]} />
  );
};
