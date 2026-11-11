import type { EditorStoreSet } from '../types'

import { getSetCanvasZoomAction } from './workspace/getSetCanvasZoomAction'
import { getSetFocusedContainerAction } from './workspace/getSetFocusedContainerAction'
import { getSetPageNameAction } from './workspace/getSetPageNameAction'
import { getTogglePreviewModeAction } from './workspace/getTogglePreviewModeAction'

export const getWorkspaceActions = (set: EditorStoreSet) => ({
  togglePreviewMode: getTogglePreviewModeAction(set),
  setFocusedContainer: getSetFocusedContainerAction(set),
  setPageName: getSetPageNameAction(set),
  setCanvasZoom: getSetCanvasZoomAction(set),
})
