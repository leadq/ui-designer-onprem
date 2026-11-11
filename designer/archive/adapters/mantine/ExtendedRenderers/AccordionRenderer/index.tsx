import type { ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';
import { Accordion, Box } from '@mantine/core';

import { useDisclosureState } from '@root/adapters/shared/disclosure/hooks/useDisclosureState';

export type AccordionRendererProps = RendererProps;

export const AccordionRenderer = (props: AccordionRendererProps) => {
  const { isExpanded, handleChange } = useDisclosureState(props);
  const { renderMode: _mode, designExpanded: _design, expanded: _expanded, defaultExpanded: _initial,
    onChange: _change, rootRef, rootClassName, title, disabled, children, style, 'data-node-id': nodeId, ...rest } = props;

  return (
    <Box ref={rootRef} className={rootClassName} data-node-id={nodeId} style={style}>
      <Accordion {...rest} value={isExpanded ? 'details' : null} onChange={(value) => handleChange(value === 'details')}>
        <Accordion.Item value="details">
          <Accordion.Control data-disclosure-trigger={nodeId} disabled={Boolean(disabled)}>{title as ReactNode}</Accordion.Control>
          <Accordion.Panel>{children as ReactNode}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};
