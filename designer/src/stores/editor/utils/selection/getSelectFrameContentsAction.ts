import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getFrameContentsSelection } from '@root/utils/frames/frameExport/getFrameContentsSelection'

export const getSelectFrameContentsAction =
  (set: EditorStoreSet): EditorActions['selectFrameContents'] =>
  (id, isAdditive = false) =>
    set((state) => {
      const selection = getFrameContentsSelection(state.nodes, id, state, isAdditive)

      if (state.previewMode || !selection) {
        return
      }

      state.selectedFrameIds = selection.frameIds

      state.selectedNodeIds = selection.nodeIds

      state.selectedTableColumnKey = null

      state.focusedContainerId = null

      state.editingFlowScreenId = id
    })
