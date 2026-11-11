import type { DesignNode } from '@root/types/document'
import { getWorkspaceNodes } from '@root/utils/frames/frameWorkspace'

import { CanvasIconEditing } from '../CanvasIconEditing'
import { DesignNodeWrapper } from '../DesignNodeWrapper'
import { ResponsiveFlowViews } from '../ResponsiveFlowViews'

export interface CanvasNodesProps {
  nodes: DesignNode[]
  isPreviewMode: boolean
}

export const CanvasNodes = ({ nodes, isPreviewMode }: CanvasNodesProps) => (
  <CanvasIconEditing>
    {isPreviewMode
      ? getWorkspaceNodes(nodes).map((node) => <DesignNodeWrapper key={node.id} node={node} />)
      : nodes
          .filter((node) => node.flow?.layout === 'root')
          .map((flow) => <ResponsiveFlowViews key={flow.id} flow={flow} nodes={nodes} />)}
  </CanvasIconEditing>
)
