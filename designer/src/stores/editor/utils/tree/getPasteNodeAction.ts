import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import {
  getFrameForNode,
  getFrameInsertionTarget,
  hasRootFrames,
} from '@root/utils/frames/frameWorkspace'
import { cloneNodeWithNewIds, findNode, findParent } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getPasteNodeAction =
  (set: EditorStoreSet): EditorActions['pasteNode'] =>
  () =>
    set((state) => {
      if (!state.copiedNode || registry[state.copiedNode.type]?.collectionItem) {
        return
      }

      const newNode = cloneNodeWithNewIds(state.copiedNode)
      let selectedId = state.selectedNodeIds.length === 1 ? state.selectedNodeIds[0] : null

      if (
        hasRootFrames(state.nodes) &&
        (!selectedId || !getFrameForNode(state.nodes, selectedId))
      ) {
        selectedId = getFrameInsertionTarget(state.nodes, state.editingFlowScreenId) ?? null
      }

      if (hasRootFrames(state.nodes) && !selectedId) {
        return
      }

      if (!selectedId) {
        // Rule 3: No selection -> paste at root
        state.nodes.push(newNode)
      } else {
        const selectedNode = findNode(state.nodes, selectedId)

        if (!selectedNode) {
          state.nodes.push(newNode)
        } else if (registry[selectedNode.type].isContainer) {
          // Rule 2: Container selected -> paste as last child
          selectedNode.children.push(newNode)
        } else {
          // Rule 1: Element selected -> paste as next sibling
          const parent = findParent(state.nodes, selectedId)
          const siblingArray = parent ? parent.children : state.nodes
          const index = siblingArray.findIndex((node) => node.id === selectedId)

          siblingArray.splice(index + 1, 0, newNode)
        }
      }

      state.selectedFrameIds = []

      state.selectedNodeIds = [newNode.id]

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
