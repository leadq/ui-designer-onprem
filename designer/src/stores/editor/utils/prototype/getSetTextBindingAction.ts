import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getConditionNodes } from '@root/utils/conditions/conditionModel'
import { canBindText, getTextFields } from '@root/utils/flows/textBindings'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getSetTextBindingAction =
  (set: EditorStoreSet): EditorActions['setTextBinding'] =>
  (nodeId, sourceNodeId) =>
    set((state) => {
      if (state.previewMode) {
        return
      }

      const node = findNode(state.nodes, nodeId)

      if (!node || !canBindText(node, registry) || !getConditionNodes(state.nodes).includes(node)) {
        return
      }

      if (
        sourceNodeId &&
        !getTextFields(state.nodes, registry).some((field) => field.id === sourceNodeId)
      ) {
        return
      }

      node.textBinding = sourceNodeId ? { ...node.textBinding, sourceNodeId } : undefined

      Object.assign(state, getNextHistory(state))
    })
