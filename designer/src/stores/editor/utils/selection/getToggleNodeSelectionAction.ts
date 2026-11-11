import type { EditorActions, EditorStoreGet, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

export const getToggleNodeSelectionAction =
  (_set: EditorStoreSet, getState: EditorStoreGet): EditorActions['toggleNodeSelection'] =>
  (id) => {
    const state = getState()
    const node = findNode(state.nodes, id)

    if (!node || node.type === 'designerFrame' || node.type === 'designerFlow') {
      return
    }

    const ids = state.selectedNodeIds.includes(id)
      ? state.selectedNodeIds.filter((selectedId) => selectedId !== id)
      : [...state.selectedNodeIds, id]

    state.setSelectedNodeIds(ids, undefined, undefined, true)
  }
