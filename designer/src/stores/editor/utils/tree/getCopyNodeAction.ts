import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getFrameIds } from '@root/utils/frames/frameWorkspace'
import { findNode } from '@root/utils/nodes'

export const getCopyNodeAction =
  (set: EditorStoreSet): EditorActions['copyNode'] =>
  (id: string) =>
    set((state) => {
      if (getFrameIds(state.nodes).has(id) || findNode(state.nodes, id)?.flow) {
        return
      }

      const node = findNode(state.nodes, id)

      if (node) {
        state.copiedNode = JSON.parse(JSON.stringify(node))
      }
    })
