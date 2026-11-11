import type { EditorStoreGet, EditorStoreSet } from '../types'

import { getAppendGeneratedDesignAction } from './documents/getAppendGeneratedDesignAction'
import { getApplyGeneratedUpdateAction } from './documents/getApplyGeneratedUpdateAction'
import { getClearDesignAction } from './documents/getClearDesignAction'
import { getLoadDesignDocumentAction } from './documents/getLoadDesignDocumentAction'
import { getLoadTemplateAction } from './documents/getLoadTemplateAction'

export const getDocumentsActions = (set: EditorStoreSet, getState: EditorStoreGet) => ({
  applyGeneratedUpdate: getApplyGeneratedUpdateAction(set, getState),
  appendGeneratedDesign: getAppendGeneratedDesignAction(set, getState),
  loadTemplate: getLoadTemplateAction(set),
  loadDesignDocument: getLoadDesignDocumentAction(set),
  clearDesign: getClearDesignAction(set),
})
