import { getAdapter } from '@root/adapters'
import type { EditorActions, EditorStoreGet, EditorStoreSet } from '@root/stores/editor/types'
import { loadAdapterDesign } from '@root/utils/designDocument'

export const getSetAdapterAction =
  (_set: EditorStoreSet, getState: EditorStoreGet): EditorActions['setAdapter'] =>
  (adapterId) => {
    getAdapter(adapterId)

    if (adapterId === getState().adapterId) {
      return
    }

    getState().loadDesignDocument(loadAdapterDesign(adapterId))
  }
