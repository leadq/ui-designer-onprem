import type { SizeAxis } from '@root/utils/layout/types'

import type { EditorStoreSet } from '../types'

import { getAlignNodeAction } from './styles/getAlignNodeAction'
import { getCommitTransientStyleUpdateAction } from './styles/getCommitTransientStyleUpdateAction'
import { getUpdateColorTokenAction } from './styles/getUpdateColorTokenAction'
import { getUpdateMultiplePropsAction } from './styles/getUpdateMultiplePropsAction'
import { getUpdateMultipleResponsiveStylesAction } from './styles/getUpdateMultipleResponsiveStylesAction'
import { getUpdatePropsAction } from './styles/getUpdatePropsAction'
import { getUpdateResponsivePropsAction } from './styles/getUpdateResponsivePropsAction'
import { getUpdateResponsiveStyleAction } from './styles/getUpdateResponsiveStyleAction'
import { getUpdateResponsiveStyleTransientAction } from './styles/getUpdateResponsiveStyleTransientAction'
import { getUpdateStyleAction } from './styles/getUpdateStyleAction'

export const getStylesActions = (set: EditorStoreSet) => ({
  updateColorToken: getUpdateColorTokenAction(set),
  updateResponsiveProps: getUpdateResponsivePropsAction(set),
  updateProps: getUpdatePropsAction(set),
  updateMultipleProps: getUpdateMultiplePropsAction(set),
  updateStyle: getUpdateStyleAction(set),
  alignNode: getAlignNodeAction(set),
  centerNode: (id: string, axis: SizeAxis) => getAlignNodeAction(set)(id, axis, 'center'),
  updateResponsiveStyle: getUpdateResponsiveStyleAction(set),
  updateResponsiveStyleTransient: getUpdateResponsiveStyleTransientAction(set),
  commitTransientStyleUpdate: getCommitTransientStyleUpdateAction(set),
  updateMultipleResponsiveStyles: getUpdateMultipleResponsiveStylesAction(set),
})
