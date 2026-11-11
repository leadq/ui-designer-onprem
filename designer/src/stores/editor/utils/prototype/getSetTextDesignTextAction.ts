import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getSetTextDesignTextAction =
  (set: EditorStoreSet): EditorActions['setTextDesignText'] =>
  (nodeId, text) =>
    set((state) => {
      if (state.previewMode) {
        return
      }

      const node = findNode(state.nodes, nodeId)

      if (!node?.textBinding || node.textBinding.designText === text) {
        return
      }

      node.textBinding.designText = text

      Object.assign(state, getNextHistory(state))
    })
