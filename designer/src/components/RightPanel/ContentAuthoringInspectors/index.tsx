import { CollectionInspector } from '../CollectionInspector'
import { DisclosureInspector } from '../DisclosureInspector'

export interface ContentAuthoringInspectorsProps {
  nodeId: string
}

export const ContentAuthoringInspectors = ({ nodeId }: ContentAuthoringInspectorsProps) => (
  <>
    <CollectionInspector nodeId={nodeId} />
    <DisclosureInspector nodeId={nodeId} />
  </>
)
