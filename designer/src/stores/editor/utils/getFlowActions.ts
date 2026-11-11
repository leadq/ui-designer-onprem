import type { EditorStoreGet, EditorStoreSet } from '../types'

import { getAddFlowAction } from './flow/getAddFlowAction'
import { getAddFlowScreenAction } from './flow/getAddFlowScreenAction'
import { getEditFlowScreenAction } from './flow/getEditFlowScreenAction'
import { getSetAdapterAction } from './flow/getSetAdapterAction'
import { getSetFlowStartAction } from './flow/getSetFlowStartAction'
import { getSetOverlaySettingsAction } from './flow/getSetOverlaySettingsAction'

export const getFlowActions = (set: EditorStoreSet, getState: EditorStoreGet) => ({
  addFlow: getAddFlowAction(set),
  addFlowScreen: getAddFlowScreenAction(set),
  setOverlaySettings: getSetOverlaySettingsAction(set),
  setFlowStart: getSetFlowStartAction(set),
  editFlowScreen: getEditFlowScreenAction(set),
  setAdapter: getSetAdapterAction(set, getState),
})
