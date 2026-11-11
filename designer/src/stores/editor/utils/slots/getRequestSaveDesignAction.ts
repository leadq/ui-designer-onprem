import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

export const getRequestSaveDesignAction =
  (set: EditorStoreSet): EditorActions['requestSaveDesign'] =>
  (nodeIds) =>
    set((state) => {
      if (nodeIds.some((id) => registry[findNode(state.nodes, id)?.type ?? '']?.collectionItem)) {
        return
      }

      state.saveDesignNodeIds = nodeIds
    })
