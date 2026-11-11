import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { createNode, findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getAddNodeToSlotAction =
  (set: EditorStoreSet): EditorActions['addNodeToSlot'] =>
  (parentId, slotKey, type) =>
    set((state) => {
      const parent = findNode(state.nodes, parentId)

      if (!parent) {
        return
      }

      const newNode = createNode(registry, type)

      if (registry[type]?.overlay) {
        return
      }

      if (!parent.slots) {
        parent.slots = {}
      }

      if (!parent.slots[slotKey]) {
        parent.slots[slotKey] = []
      }

      parent.slots[slotKey].push(newNode)

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex

      state.selectedFrameIds = []

      state.selectedNodeIds = [newNode.id]
    })
