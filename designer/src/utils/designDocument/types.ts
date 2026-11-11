import type { DesignAnnotation, DesignNode, SlotComponent } from '@root/types/document'

import { DESIGN_SCHEMA_VERSION } from './constants'

export interface DesignDocument {
  version: typeof DESIGN_SCHEMA_VERSION
  adapterId: string
  pageName: string
  pageNotes: string
  pageAnnotations: DesignAnnotation[]
  nodes: DesignNode[]
  savedDesigns?: SlotComponent[]
}
