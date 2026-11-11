import type { EditorStoreSet } from '../types'

import { getAddNodeToSlotAction } from './slots/getAddNodeToSlotAction'
import { getCancelSaveDesignAction } from './slots/getCancelSaveDesignAction'
import { getCreateSlotComponentAction } from './slots/getCreateSlotComponentAction'
import { getDeleteSlotComponentAction } from './slots/getDeleteSlotComponentAction'
import { getInsertSavedDesignAction } from './slots/getInsertSavedDesignAction'
import { getRemoveNodeFromSlotAction } from './slots/getRemoveNodeFromSlotAction'
import { getRequestSaveDesignAction } from './slots/getRequestSaveDesignAction'
import { getUpdateSlotComponentAction } from './slots/getUpdateSlotComponentAction'
import { getUpdateSlotNodesAction } from './slots/getUpdateSlotNodesAction'

export const getSlotsActions = (set: EditorStoreSet) => ({
  addNodeToSlot: getAddNodeToSlotAction(set),
  removeNodeFromSlot: getRemoveNodeFromSlotAction(set),
  updateSlotNodes: getUpdateSlotNodesAction(set),
  createSlotComponent: getCreateSlotComponentAction(set),
  updateSlotComponent: getUpdateSlotComponentAction(set),
  deleteSlotComponent: getDeleteSlotComponentAction(set),
  insertSavedDesign: getInsertSavedDesignAction(set),
  requestSaveDesign: getRequestSaveDesignAction(set),
  cancelSaveDesign: getCancelSaveDesignAction(set),
})
