import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateToggleBindings } from '@root/utils/conditions/toggleBindings'
import { getAllNodes } from '@root/utils/flows/flowModel'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getSetToggleBindingAction =
  (set: EditorStoreSet): EditorActions['setToggleBinding'] =>
  (nodeId, binding) =>
    set((state) => {
      if (state.previewMode) {
        return
      }

      const node = findNode(state.nodes, nodeId)

      if (!node) {
        return
      }

      for (const peer of getAllNodes(state.nodes)) {
        if (peer.toggleBinding) {
          peer.toggleBinding.exclusiveWith = peer.toggleBinding.exclusiveWith.filter(
            (id) => id !== nodeId,
          )
        }
      }

      node.toggleBinding = binding

      validateToggleBindings(state.nodes, registry)

      const history = getNextHistory(state)

      state.history = history.history

      state.historyIndex = history.historyIndex
    })
