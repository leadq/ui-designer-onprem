import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import {
  getFrameForNode,
  getFrameIds,
  getFrameInsertionTarget,
} from '@root/utils/frames/frameWorkspace'
import { cloneNodesForReuse, findNode, findParent } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getInsertSavedDesignAction =
  (set: EditorStoreSet): EditorActions['insertSavedDesign'] =>
  (id, targetId, position = 'inside') =>
    set((state) => {
      const savedDesign = state.slotComponents.find((item) => item.id === id)

      if (
        !savedDesign?.nodes.length ||
        savedDesign.nodes.some((node) => registry[node.type]?.collectionItem)
      ) {
        return
      }

      if (!targetId || targetId === 'canvas-root') {
        targetId = getFrameInsertionTarget(state.nodes, state.editingFlowScreenId)

        position = 'inside'
      }

      if (
        !targetId ||
        !getFrameForNode(state.nodes, targetId) ||
        (position !== 'inside' && getFrameIds(state.nodes).has(targetId))
      ) {
        return
      }

      if (savedDesign.nodes.some((node) => node.flow)) {
        return
      }

      const insertionTarget = targetId ? findNode(state.nodes, targetId) : null

      if (
        insertionTarget &&
        ((position !== 'inside' && registry[insertionTarget.type]?.collectionItem) ||
          (position === 'inside' && !registry[insertionTarget.type]?.isContainer))
      ) {
        return
      }

      const copies = cloneNodesForReuse(savedDesign.nodes)
      let destination = state.nodes
      let insertIndex = destination.length

      if (targetId && targetId !== 'canvas-root') {
        const target = findNode(state.nodes, targetId)

        if (position === 'inside' && target && registry[target.type]?.isContainer) {
          destination = target.children

          insertIndex = destination.length
        } else if (position !== 'inside' && target) {
          const parent = findParent(state.nodes, targetId)

          destination = parent?.children ?? state.nodes

          const targetIndex = destination.findIndex((node) => node.id === targetId)

          insertIndex =
            targetIndex < 0 ? destination.length : targetIndex + (position === 'after' ? 1 : 0)
        }
      }

      destination.splice(insertIndex, 0, ...copies)

      state.selectedFrameIds = []

      state.selectedNodeIds = copies.map((node) => node.id)

      const history = getNextHistory(state)

      state.history = history.history

      state.historyIndex = history.historyIndex
    })
