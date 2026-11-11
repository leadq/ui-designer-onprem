import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import type { DesignNode } from '@root/types/document'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getRemoveSelectedNodesAction =
  (set: EditorStoreSet): EditorActions['removeSelectedNodes'] =>
  () =>
    set((state) => {
      if (state.selectedNodeIds.length === 0) {
        return
      }

      const cellIds = new Set(state.selectedNodeIds.filter((id) => isTableCell(state.nodes, id)))

      const idsToRemove = new Set(
        state.selectedNodeIds.filter(
          (id) => !cellIds.has(id) && !isCollectionItem(state.nodes, id),
        ),
      )

      const getRemainingNodes = (nodes: DesignNode[]): DesignNode[] =>
        nodes
          .filter((node) => !idsToRemove.has(node.id))
          .map((node) => {
            const updatedNode = {
              ...node,
              children: cellIds.has(node.id) ? [] : getRemainingNodes(node.children),
            }

            if (updatedNode.slots) {
              const updatedSlots: Record<string, DesignNode[]> = {}

              for (const [key, slotNodes] of Object.entries(updatedNode.slots)) {
                const filteredSlotNodes = getRemainingNodes(slotNodes)

                if (filteredSlotNodes.length > 0) {
                  updatedSlots[key] = filteredSlotNodes
                }
              }

              if (Object.keys(updatedSlots).length > 0) {
                updatedNode.slots = updatedSlots
              } else {
                delete updatedNode.slots
              }
            }

            return updatedNode
          })

      state.nodes = getRemainingNodes(state.nodes)

      state.selectedFrameIds = []

      state.selectedNodeIds = []

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
