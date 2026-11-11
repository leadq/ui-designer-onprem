import type {
  DesignAnnotation,
  DesignNode,
  SlotComponent,
  TemplateMetadata,
} from '@root/types/document'
import type { DesignDocument } from '@root/utils/designDocument'
import type { BehaviorEntry } from '@root/utils/getBehaviorEntries'

export interface DesignSyncInput {
  adapterId?: string
  nodes: DesignNode[]
  pageName: string
  pageNotes: string
  pageAnnotations: DesignAnnotation[]
  slotComponents: SlotComponent[]
  metadata?: TemplateMetadata | null
}

export interface McpSyncPayload {
  editorId: string
  document: DesignDocument
  adapterId: string
  tsx: string
  tree: DesignNode[]
  pageName: string
  behaviors: BehaviorEntry[]
  metadata: {
    projectName: string
    routeName: string
    componentName: string
    routeKey: string
  } | null
  timestamp: number
}
