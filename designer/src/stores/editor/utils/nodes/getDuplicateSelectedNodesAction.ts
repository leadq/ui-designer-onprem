import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import type { DesignNode } from '@root/types/document'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { getFrameIds } from '@root/utils/frames/frameWorkspace'
import { cloneNodeWithNewIds } from '@root/utils/nodes'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getDuplicateSelectedNodesAction =
  (set: EditorStoreSet): EditorActions['duplicateSelectedNodes'] =>
  () =>
    set((state) => {
      if (state.selectedNodeIds.length === 0) {
        return
      }

      const newSelectionIds: string[] = []

      const getDuplicateInTree = (nodes: DesignNode[]): DesignNode[] => {
        const result: DesignNode[] = []

        for (const node of nodes) {
          const updatedNode = { ...node, children: getDuplicateInTree(node.children) }

          if (updatedNode.slots) {
            const updatedSlots: Record<string, DesignNode[]> = {}

            for (const [key, slotNodes] of Object.entries(updatedNode.slots)) {
              updatedSlots[key] = getDuplicateInTree(slotNodes)
            }

            updatedNode.slots = updatedSlots
          }

          result.push(updatedNode)

          if (
            state.selectedNodeIds.includes(node.id) &&
            !(isTableCell(state.nodes, node.id) || isCollectionItem(state.nodes, node.id)) &&
            !getFrameIds(state.nodes).has(node.id) &&
            !node.flow
          ) {
            const duplicated = cloneNodeWithNewIds(node)

            newSelectionIds.push(duplicated.id)

            result.push(duplicated)
          }
        }

        return result
      }

      state.nodes = getDuplicateInTree(state.nodes)

      state.selectedFrameIds = []

      state.selectedNodeIds = newSelectionIds

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
