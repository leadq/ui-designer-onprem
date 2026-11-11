import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { getFrameForNode, getFrameIds, hasRootFrames } from '@root/utils/frames/frameWorkspace'
import { findNode, findParent, isDescendant } from '@root/utils/nodes'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getMoveNodeAction =
  (set: EditorStoreSet): EditorActions['moveNode'] =>
  (sourceId, targetId, position) =>
    set((state) => {
      if (
        isTableCell(state.nodes, sourceId) ||
        isCollectionItem(state.nodes, sourceId) ||
        (position !== 'inside' &&
          (isTableCell(state.nodes, targetId) || isCollectionItem(state.nodes, targetId)))
      ) {
        return
      }

      if (hasRootFrames(state.nodes)) {
        const frames = getFrameIds(state.nodes)

        if (frames.has(sourceId) || findNode(state.nodes, sourceId)?.flow) {
          return
        }

        if (
          targetId === 'canvas-root' ||
          !getFrameForNode(state.nodes, targetId) ||
          (position !== 'inside' && frames.has(targetId))
        ) {
          return
        }
      }

      const sourceNode = findNode(state.nodes, sourceId)

      if (!sourceNode) {
        return
      }

      // Prevent dropping a node into its own descendant (circular reference)
      if (isDescendant(sourceNode, targetId)) {
        return
      }

      // Prevent dropping onto itself
      if (sourceId === targetId) {
        return
      }

      const destination = findNode(state.nodes, targetId)

      if (targetId !== 'canvas-root' && !destination) {
        return
      }

      if (
        position === 'inside' &&
        targetId !== 'canvas-root' &&
        !registry[destination!.type]?.isContainer
      ) {
        return
      }

      if (targetId === 'canvas-root' && position !== 'inside') {
        return
      }

      // Remove from current parent
      const sourceParent = findParent(state.nodes, sourceId)

      if (sourceParent) {
        sourceParent.children = sourceParent.children.filter((child) => child.id !== sourceId)

        if (sourceParent.slots) {
          for (const [key, slotNodes] of Object.entries(sourceParent.slots)) {
            sourceParent.slots[key] = slotNodes.filter((child) => child.id !== sourceId)

            if (sourceParent.slots[key].length === 0) {
              delete sourceParent.slots[key]
            }
          }

          if (Object.keys(sourceParent.slots).length === 0) {
            delete sourceParent.slots
          }
        }
      } else {
        state.nodes = state.nodes.filter((node) => node.id !== sourceId)
      }

      // Add to new position
      if (position === 'inside') {
        if (targetId === 'canvas-root') {
          state.nodes.push(sourceNode)
        } else {
          const targetNode = findNode(state.nodes, targetId)

          if (targetNode && registry[targetNode.type]?.isContainer) {
            targetNode.children.push(sourceNode)
          }
        }
      } else {
        const targetParent = findParent(state.nodes, targetId)
        let siblingArray = targetParent ? targetParent.children : state.nodes

        // If the target is inside a slot of targetParent, siblingArray is the slot array
        if (targetParent && targetParent.slots) {
          for (const slotNodes of Object.values(targetParent.slots)) {
            if (slotNodes.some((node) => node.id === targetId)) {
              siblingArray = slotNodes

              break
            }
          }
        }

        const targetIndex = siblingArray.findIndex((node) => node.id === targetId)

        if (position === 'before') {
          siblingArray.splice(targetIndex, 0, sourceNode)
        } else {
          siblingArray.splice(targetIndex + 1, 0, sourceNode)
        }
      }

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
