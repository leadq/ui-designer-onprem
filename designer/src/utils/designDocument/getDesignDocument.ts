import { DEFAULT_ADAPTER_ID, getAdapter } from '@root/adapters'
import type { DesignAnnotation, DesignNode, SlotComponent } from '@root/types/document'

import { DESIGN_SCHEMA_VERSION } from './constants'
import type { DesignDocument } from './types'

export const getDesignDocument = (
  nodes: DesignNode[],
  pageName: string,
  pageNotes: string,
  pageAnnotations: DesignAnnotation[],
  savedDesigns?: SlotComponent[],
  adapterId = DEFAULT_ADAPTER_ID,
): DesignDocument => ({
  version: DESIGN_SCHEMA_VERSION,
  adapterId: getAdapter(adapterId).id,
  pageName,
  pageNotes,
  pageAnnotations,
  nodes,
  ...(savedDesigns ? { savedDesigns } : {}),
})
