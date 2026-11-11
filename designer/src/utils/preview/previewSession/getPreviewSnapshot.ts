import type { PageState } from '@root/stores/editor/pageState'
import { createDesignDocument } from '@root/utils/designDocument'
import { getFlowOwner } from '@root/utils/flows/flowModel'

import type { PreviewSnapshot } from './types'

export const getPreviewSnapshot = (state: PageState, createdAt: number): PreviewSnapshot => ({
  createdAt,
  flowId: state.editingFlowScreenId
    ? getFlowOwner(state.nodes, state.editingFlowScreenId)?.id
    : undefined,
  document: createDesignDocument(
    state.nodes,
    state.pageName,
    state.pageNotes,
    state.pageAnnotations,
    state.slotComponents,
    state.adapterId,
  ),
})
