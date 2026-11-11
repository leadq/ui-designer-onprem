import type { EditorStoreSet } from '../types'

import { getAddNodeAction } from './nodes/getAddNodeAction'
import { getDuplicateSelectedNodesAction } from './nodes/getDuplicateSelectedNodesAction'
import { getRemoveNodeAction } from './nodes/getRemoveNodeAction'
import { getRemoveSelectedNodesAction } from './nodes/getRemoveSelectedNodesAction'

export const getNodesActions = (set: EditorStoreSet) => ({
  addNode: getAddNodeAction(set),
  removeNode: getRemoveNodeAction(set),
  removeSelectedNodes: getRemoveSelectedNodesAction(set),
  duplicateSelectedNodes: getDuplicateSelectedNodesAction(set),
})
