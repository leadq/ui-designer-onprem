import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

export const getEditFlowScreenAction =
  (set: EditorStoreSet): EditorActions['editFlowScreen'] =>
  (screenId) =>
    set((state) => {
      state.editingFlowScreenId = screenId

      state.focusedContainerId = screenId

      const screen = screenId ? findNode(state.nodes, screenId) : null

      state.selectedFrameIds = []

      state.selectedNodeIds = screen && screen.type !== 'designerFrame' ? [screen.id] : []
    })
