import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateComponentContract } from '@root/utils/designer/componentContract'
import { findNode } from '@root/utils/nodes'
import { findParent } from '@root/utils/nodes/findParent'

import { getNextHistory } from '../getNextHistory'

export const getUpdateSlotNodesAction =
  (set: EditorStoreSet): EditorActions['updateSlotNodes'] =>
  (parentId, slotKey, nodes) =>
    set((state) => {
      const parent = findNode(state.nodes, parentId)

      if (!parent) {
        return
      }

      if (!parent.slots) {
        parent.slots = {}
      }

      if (nodes.length > 0) {
        parent.slots[slotKey] = nodes
      } else {
        delete parent.slots[slotKey]
      }

      validateComponentContract([parent], registry, findParent(state.nodes, parent.id) ?? undefined)

      if (parent.slots && Object.keys(parent.slots).length === 0) {
        delete parent.slots
      }

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
