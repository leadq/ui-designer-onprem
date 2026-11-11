import type { EditorActions, EditorStoreGet, EditorStoreSet } from '@root/stores/editor/types'
import { parseDesignDocument } from '@root/utils/designDocument'
import { cloneNodesForReuse } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getAppendGeneratedDesignAction =
  (set: EditorStoreSet, getState: EditorStoreGet): EditorActions['appendGeneratedDesign'] =>
  (document) => {
    document = parseDesignDocument(document)

    const current = getState()

    if (
      current.previewMode ||
      current.adapterId !== document.adapterId ||
      document.savedDesigns?.length
    ) {
      throw new Error('Incompatible generated design')
    }

    const additions = cloneNodesForReuse(document.nodes)

    const frameIds = additions
      .filter((node) => node.type === 'designerFrame')
      .map((node) => node.id)

    if (!frameIds.length) {
      throw new Error('Generated design must contain at least one frame')
    }

    set((state) => {
      state.nodes.push(...additions)

      state.editingFlowScreenId = frameIds[0]

      state.focusedContainerId = frameIds[0]

      state.selectedFrameIds = []

      state.selectedNodeIds = []

      state.workspaceRevision += 1

      Object.assign(state, getNextHistory(state))
    })

    return frameIds
  }
