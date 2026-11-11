import { useEditorStore } from '@root/stores/editor'
import { createDesignDocument } from '@root/utils/designDocument'

export const getCurrentDesign = () => {
  const state = useEditorStore.getState()

  return createDesignDocument(
    state.nodes,
    state.pageName,
    state.pageNotes,
    state.pageAnnotations,
    state.slotComponents,
    state.adapterId,
  )
}
