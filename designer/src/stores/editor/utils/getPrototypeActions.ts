import type { EditorStoreSet } from '../types'

import { getRunNodeInteractionsAction } from './prototype/getRunNodeInteractionsAction'
import { getSetComponentStateAction } from './prototype/getSetComponentStateAction'
import { getSetPrototypeExampleAction } from './prototype/getSetPrototypeExampleAction'
import { getSetPrototypeHiddenAction } from './prototype/getSetPrototypeHiddenAction'
import { getSetPrototypeValueAction } from './prototype/getSetPrototypeValueAction'
import { getSetTextBindingAction } from './prototype/getSetTextBindingAction'
import { getSetTextDesignTextAction } from './prototype/getSetTextDesignTextAction'
import { getSetToggleBindingAction } from './prototype/getSetToggleBindingAction'

export const getPrototypeActions = (set: EditorStoreSet) => ({
  setPrototypeHidden: getSetPrototypeHiddenAction(set),
  setComponentState: getSetComponentStateAction(set),
  setTextBinding: getSetTextBindingAction(set),
  setTextDesignText: getSetTextDesignTextAction(set),
  setToggleBinding: getSetToggleBindingAction(set),
  setPrototypeValue: getSetPrototypeValueAction(set),
  setPrototypeExample: getSetPrototypeExampleAction(set),
  runNodeInteractions: getRunNodeInteractionsAction(set),
})
