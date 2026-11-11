import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getAllNodes } from '@root/utils/flows/flowModel'
import { findNode, isDescendant } from '@root/utils/nodes'
import { getSelectionContainerId } from '@root/utils/selection/getSelectionContainerId'

export const getSetSelectedNodeIdsAction =
  (set: EditorStoreSet): EditorActions['setSelectedNodeIds'] =>
  (ids, focusedContainerId, tableColumnKey, shouldPreserveFrameSelection = false) =>
    set((state) => {
      const selectableIds = ids.filter((id) => {
        const node = findNode(state.nodes, id)

        return node && node.type !== 'designerFrame' && node.type !== 'designerFlow'
      })

      if (!shouldPreserveFrameSelection) {
        state.selectedFrameIds = []
      }

      state.selectedNodeIds = selectableIds

      state.selectedTableColumnKey = selectableIds.length === 1 ? (tableColumnKey ?? null) : null

      // Empty selection can deliberately keep an entered, empty container focused.
      if (selectableIds.length) {
        state.focusedContainerId = getSelectionContainerId(state.nodes, selectableIds)
      } else if (ids.length === 1 && findNode(state.nodes, ids[0])?.type === 'designerFrame') {
        state.focusedContainerId = ids[0]
      }

      if (focusedContainerId !== undefined) {
        state.focusedContainerId = focusedContainerId
      }

      if (ids.length === 1) {
        const all = getAllNodes(state.nodes)
        const screens = all.flatMap((node) => node.flow?.screens ?? [])

        const screen = screens.find((item) => {
          const root = findNode(state.nodes, item.nodeId)

          return root && (root.id === ids[0] || isDescendant(root, ids[0]))
        })

        if (screen) {
          state.editingFlowScreenId = screen.nodeId
        } else if (findNode(state.nodes, ids[0])?.flow) {
          state.editingFlowScreenId = null
        }
      }
    })
