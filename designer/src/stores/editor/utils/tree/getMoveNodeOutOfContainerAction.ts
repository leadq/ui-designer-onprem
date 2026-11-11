import type { EditorActions, EditorStoreGet, EditorStoreSet } from '@root/stores/editor/types'
import { getFrameIds, hasRootFrames } from '@root/utils/frames/frameWorkspace'
import { findParent } from '@root/utils/nodes'

export const getMoveNodeOutOfContainerAction =
  (_set: EditorStoreSet, getState: EditorStoreGet): EditorActions['moveNodeOutOfContainer'] =>
  (id) => {
    const state = getState()
    const parent = findParent(state.nodes, id)

    if (!parent || (hasRootFrames(state.nodes) && getFrameIds(state.nodes).has(parent.id))) {
      return
    }

    const grandparent = findParent(state.nodes, parent.id)

    state.moveNode(id, parent.id, 'after')

    state.setFocusedContainer(grandparent?.id ?? null)

    state.setSelectedNodeIds([id])
  }
