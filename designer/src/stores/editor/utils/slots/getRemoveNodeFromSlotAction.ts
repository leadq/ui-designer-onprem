import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateComponentContract } from '@root/utils/designer/componentContract'
import { findNode } from '@root/utils/nodes'
import { findParent } from '@root/utils/nodes/findParent'

import { getNextHistory } from '../getNextHistory'

export const getRemoveNodeFromSlotAction =
  (set: EditorStoreSet): EditorActions['removeNodeFromSlot'] =>
  (parentId, slotKey, nodeId) =>
    set((state) => {
      const parent = findNode(state.nodes, parentId)

      if (!parent?.slots?.[slotKey]) {
        return
      }

      parent.slots[slotKey] = parent.slots[slotKey].filter((node) => node.id !== nodeId)

      // Clean up empty slot
      if (parent.slots[slotKey].length === 0) {
        delete parent.slots[slotKey]
      }

      validateComponentContract([parent], registry, findParent(state.nodes, parent.id) ?? undefined)

      if (parent.slots && Object.keys(parent.slots).length === 0) {
        delete parent.slots
      }

      state.selectedFrameIds = []

      state.selectedNodeIds = state.selectedNodeIds.filter((id) => id !== nodeId)

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
