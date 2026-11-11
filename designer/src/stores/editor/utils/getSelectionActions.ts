import type { EditorStoreGet, EditorStoreSet } from '../types'

import { getClearSelectionAction } from './selection/getClearSelectionAction'
import { getSelectFrameContentsAction } from './selection/getSelectFrameContentsAction'
import { getSetActiveBreakpointAction } from './selection/getSetActiveBreakpointAction'
import { getSetCanvasWidthAction } from './selection/getSetCanvasWidthAction'
import { getSetDropTargetAction } from './selection/getSetDropTargetAction'
import { getSetInteractionStateAction } from './selection/getSetInteractionStateAction'
import { getSetSelectedNodeIdsAction } from './selection/getSetSelectedNodeIdsAction'
import { getToggleNodeSelectionAction } from './selection/getToggleNodeSelectionAction'

export const getSelectionActions = (set: EditorStoreSet, getState: EditorStoreGet) => ({
  setSelectedNodeIds: getSetSelectedNodeIdsAction(set),
  toggleNodeSelection: getToggleNodeSelectionAction(set, getState),
  clearSelection: getClearSelectionAction(set),
  selectFrameContents: getSelectFrameContentsAction(set),
  setDropTarget: getSetDropTargetAction(set),
  setInteractionState: getSetInteractionStateAction(set),
  setCanvasWidth: getSetCanvasWidthAction(set),
  setActiveBreakpoint: getSetActiveBreakpointAction(set),
})
