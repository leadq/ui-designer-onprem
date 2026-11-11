import { getBootDocument } from '@root/utils/workspacePersistence/state'

import { parseDesignDocument } from './parseDesignDocument'
import type { DesignDocument } from './types'

export const loadAutosavedDesign = (): DesignDocument | null =>
  getBootDocument() ? parseDesignDocument(getBootDocument()) : null
