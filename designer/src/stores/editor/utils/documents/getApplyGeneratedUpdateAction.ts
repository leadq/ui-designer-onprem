import type { EditorActions, EditorStoreGet, EditorStoreSet } from '@root/stores/editor/types'
import { parseDesignDocument } from '@root/utils/designDocument'
import { getAllNodes } from '@root/utils/flows/flowModel'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getApplyGeneratedUpdateAction =
  (set: EditorStoreSet, getState: EditorStoreGet): EditorActions['applyGeneratedUpdate'] =>
  (document, changedNodeIds) => {
    document = parseDesignDocument(document)

    const current = getState()

    if (current.previewMode || current.adapterId !== document.adapterId) {
      throw new Error('Incompatible editor update')
    }

    if (JSON.stringify(current.nodes) === JSON.stringify(document.nodes)) {
      return []
    }

    set((state) => {
      state.nodes = document.nodes

      const ids = new Set(getAllNodes(state.nodes).map((node) => node.id))

      state.selectedFrameIds = []

      state.selectedNodeIds = changedNodeIds.filter(
        (id) =>
          ids.has(id) &&
          !['designerFrame', 'designerFlow'].includes(findNode(state.nodes, id)?.type ?? ''),
      )

      if (state.focusedContainerId && !ids.has(state.focusedContainerId)) {
        state.focusedContainerId = null
      }

      if (state.editingFlowScreenId && !ids.has(state.editingFlowScreenId)) {
        state.editingFlowScreenId = null
      }

      Object.assign(state, getNextHistory(state))
    })

    return document.nodes.filter((node) => node.type === 'designerFrame').map((node) => node.id)
  }
