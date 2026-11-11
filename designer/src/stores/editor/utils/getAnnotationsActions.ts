import type { EditorStoreSet } from '../types'

import { getRemoveAnnotationAction } from './annotations/getRemoveAnnotationAction'
import { getRemoveInteractionAction } from './annotations/getRemoveInteractionAction'
import { getUpdateNodeLabelAction } from './annotations/getUpdateNodeLabelAction'
import { getUpdateNodeNotesAction } from './annotations/getUpdateNodeNotesAction'
import { getUpdatePageNotesAction } from './annotations/getUpdatePageNotesAction'
import { getUpsertAnnotationAction } from './annotations/getUpsertAnnotationAction'
import { getUpsertInteractionAction } from './annotations/getUpsertInteractionAction'

export const getAnnotationsActions = (set: EditorStoreSet) => ({
  updateNodeLabel: getUpdateNodeLabelAction(set),
  updateNodeNotes: getUpdateNodeNotesAction(set),
  updatePageNotes: getUpdatePageNotesAction(set),
  upsertAnnotation: getUpsertAnnotationAction(set),
  removeAnnotation: getRemoveAnnotationAction(set),
  upsertInteraction: getUpsertInteractionAction(set),
  removeInteraction: getRemoveInteractionAction(set),
})
