import type { DesignNode } from '@root/types/document'
import type { DesignDocument } from '@root/utils/designDocument'
import { getFlowManifest } from '@root/utils/flows/flowManifest'

export interface FlatNode extends Omit<DesignNode, 'children' | 'slots'> {
  parentId: string | null
  slotKey: string | null
  index: number
  childIds: string[]
  slotChildIds?: Record<string, string[]>
}

export interface FlatTree {
  rootIds: string[]
  nodesById: Record<string, FlatNode>
}

export interface FlatDesignDocument
  extends Omit<DesignDocument, 'version' | 'nodes' | 'savedDesigns'>, FlatTree {
  format: 'ui-design/flat'
  version: 1
  designVersion: number
  behavior: ReturnType<typeof getFlowManifest>
  savedDesigns?: (FlatTree & { id: string; name: string })[]
}
