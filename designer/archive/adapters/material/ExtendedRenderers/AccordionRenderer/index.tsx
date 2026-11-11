import type { ReactNode } from 'react';

import { useStableId } from '@root/hooks/useStableId';

import type { RendererProps } from '@root/types/componentContract';
import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { useDisclosureState } from '@root/adapters/shared/disclosure/hooks/useDisclosureState';

export type AccordionRendererProps = RendererProps;

export const AccordionRenderer = (props: AccordionRendererProps) => {
  const generatedId = useStableId();
  const { isExpanded, handleChange } = useDisclosureState(props);
  const { renderMode: _mode, designExpanded: _design, expanded: _expanded, defaultExpanded: _initial,
    onChange: _change, rootRef, rootClassName, title, disabled, children, ...rest } = props;
  const id = String(props['data-node-id'] ?? generatedId);

  return (
    <Accordion {...rest} ref={rootRef} className={rootClassName} disabled={Boolean(disabled)}
      expanded={isExpanded} onChange={(_event, next) => handleChange(next)}>
      <AccordionSummary data-disclosure-trigger={props['data-node-id']} id={`${id}-header`} aria-controls={`${id}-panel`} expandIcon={<ChevronDown aria-hidden size={18} />}>
        {title as ReactNode}
      </AccordionSummary>
      <AccordionDetails>{children as ReactNode}</AccordionDetails>
    </Accordion>
  );
};
