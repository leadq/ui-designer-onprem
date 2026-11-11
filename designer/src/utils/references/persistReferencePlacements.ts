import { useReferenceStore } from '@root/stores/referenceStore'
import { writeReference } from '@root/utils/references/storage'

export const persistReferencePlacements = async (ids: string[]) => {
  const state = useReferenceStore.getState()

  state.setWorkspaceError(false)

  try {
    await Promise.all(state.images.filter((image) => ids.includes(image.id)).map(writeReference))
  } catch {
    useReferenceStore.getState().setWorkspaceError(true)
  }
}
