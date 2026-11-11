import { ToggleBindingEditor } from '@root/components/Flows/ToggleBindingEditor'

import { TableCellInspector } from '../TableCellInspector'

export interface SelectionContextInspectorsProps {
  nodeId: string
}

export const SelectionContextInspectors = ({ nodeId }: SelectionContextInspectorsProps) => (
  <>
    <TableCellInspector nodeId={nodeId} />
    <ToggleBindingEditor nodeId={nodeId} />
  </>
)
