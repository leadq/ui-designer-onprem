import { getAdapter } from '@root/adapters'
import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { parseDesignDocument } from '@root/utils/designDocument'
import { getFrameInsertionTarget, normalizeFrameWorkspace } from '@root/utils/frames/frameWorkspace'

export const getLoadTemplateAction =
  (set: EditorStoreSet): EditorActions['loadTemplate'] =>
  (templateNodes) =>
    set((state) => {
      state.workspaceRevision += 1

      state.copiedNode = null

      state.editingFlowScreenId = null

      state.nodes = normalizeFrameWorkspace(
        parseDesignDocument({ adapterId: state.adapterId, nodes: templateNodes }).nodes,
        registry,
        getAdapter(state.adapterId).defaultContainerType,
      )

      state.focusedContainerId = getFrameInsertionTarget(state.nodes, null) ?? null

      state.editingFlowScreenId = state.focusedContainerId

      state.selectedFrameIds = []

      state.selectedNodeIds = []

      state.history = [JSON.parse(JSON.stringify(state.nodes))]

      state.historyIndex = 0
    })
