import type { EditorStoreGet, EditorStoreSet } from '../types'

import { getCopyNodeAction } from './tree/getCopyNodeAction'
import { getCycleOutlineModeAction } from './tree/getCycleOutlineModeAction'
import { getDuplicateNodeAction } from './tree/getDuplicateNodeAction'
import { getMoveNodeAction } from './tree/getMoveNodeAction'
import { getMoveNodeOrderingAction } from './tree/getMoveNodeOrderingAction'
import { getMoveNodeOutOfContainerAction } from './tree/getMoveNodeOutOfContainerAction'
import { getPasteNodeAction } from './tree/getPasteNodeAction'
import { getRedoAction } from './tree/getRedoAction'
import { getUndoAction } from './tree/getUndoAction'
import { getUnwrapContainerAction } from './tree/getUnwrapContainerAction'
import { getWrapInContainerAction } from './tree/getWrapInContainerAction'

export const getTreeActions = (set: EditorStoreSet, getState: EditorStoreGet) => ({
  moveNode: getMoveNodeAction(set),
  undo: getUndoAction(set),
  cycleOutlineMode: getCycleOutlineModeAction(set),
  redo: getRedoAction(set),
  copyNode: getCopyNodeAction(set),
  pasteNode: getPasteNodeAction(set),
  duplicateNode: getDuplicateNodeAction(set),
  wrapInContainer: getWrapInContainerAction(set),
  moveNodeOutOfContainer: getMoveNodeOutOfContainerAction(set, getState),
  unwrapContainer: getUnwrapContainerAction(set),
  moveNodeOrdering: getMoveNodeOrderingAction(set),
})
