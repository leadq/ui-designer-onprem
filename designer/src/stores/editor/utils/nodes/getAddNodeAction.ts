import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { isCollectionItem } from '@root/utils/collectionAuthoring/isCollectionItem'
import { getOverlayInsertion } from '@root/utils/flows/getOverlayInsertion'
import {
  getFrameForNode,
  getFrameIds,
  getFrameInsertionTarget,
  hasRootFrames,
} from '@root/utils/frames/frameWorkspace'
import { createNode, findNode, findParent } from '@root/utils/nodes'
import { isTableCell } from '@root/utils/tableAuthoring/isTableCell'

import { getNextHistory } from '../getNextHistory'

export const getAddNodeAction =
  (set: EditorStoreSet): EditorActions['addNode'] =>
  (type, targetId, position = 'inside') =>
    set((state) => {
      if (
        targetId &&
        position !== 'inside' &&
        (isTableCell(state.nodes, targetId) || isCollectionItem(state.nodes, targetId))
      ) {
        return
      }

      if (registry[type]?.collectionItem) {
        return
      }

      const newNode = createNode(registry, type)

      if (registry[type]?.overlay) {
        const insertion = getOverlayInsertion(state, newNode, registry, targetId)
        const flow = insertion ? findNode(state.nodes, insertion.flowId)?.flow : undefined

        if (!insertion || !flow) {
          return
        }

        state.nodes.push(insertion.node)

        flow.screens.push({ nodeId: insertion.node.id, kind: 'overlay' })

        state.editingFlowScreenId = insertion.node.id

        state.focusedContainerId = insertion.node.id

        const history = getNextHistory(state)

        state.history = history.history

        state.historyIndex = history.historyIndex

        state.selectedFrameIds = []

        state.selectedNodeIds = [newNode.id]

        return
      }

      if (hasRootFrames(state.nodes)) {
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
      }

      if (
        !targetId &&
        state.editingFlowScreenId &&
        findNode(state.nodes, state.editingFlowScreenId)
      ) {
        targetId = state.editingFlowScreenId
      }

      if (!targetId || targetId === 'canvas-root') {
        state.nodes.push(newNode)
      } else {
        if (position === 'inside') {
          const target = findNode(state.nodes, targetId)

          if (target && registry[target.type]?.isContainer) {
            target.children.push(newNode)
          } else {
            return
          }
        } else {
          const parent = findParent(state.nodes, targetId)

          const siblingArray = parent
            ? [parent.children, ...Object.values(parent.slots ?? {})].find((items) =>
                items.some((node) => node.id === targetId),
              )
            : state.nodes

          if (!siblingArray) {
            return
          }

          const index = siblingArray.findIndex((node) => node.id === targetId)

          if (index !== -1) {
            siblingArray.splice(position === 'after' ? index + 1 : index, 0, newNode)
          } else {
            return
          }
        }
      }

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex

      state.selectedFrameIds = []

      state.selectedNodeIds = [newNode.id]
    })
