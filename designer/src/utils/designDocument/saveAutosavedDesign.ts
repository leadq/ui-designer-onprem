import { queueWorkspaceAutosave } from '@root/utils/workspacePersistence/queueWorkspaceAutosave'

import { parseDesignDocument } from './parseDesignDocument'
import type { DesignDocument } from './types'

export const saveAutosavedDesign = (document: DesignDocument): void => {
  queueWorkspaceAutosave(parseDesignDocument(document))
}
