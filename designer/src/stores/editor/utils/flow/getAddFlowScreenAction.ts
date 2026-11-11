import { getAdapter } from '@root/adapters'
import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { createFrame, promoteFlowFrames } from '@root/utils/frames/frameWorkspace'
import { createNode, findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getAddFlowScreenAction =
  (set: EditorStoreSet): EditorActions['addFlowScreen'] =>
  (flowId, kind, label, overlay) =>
    set((state) => {
      promoteFlowFrames(state.nodes)

      const root = findNode(state.nodes, flowId)

      if (!root?.flow) {
        return
      }

      const screen =
        kind === 'overlay'
          ? {
              ...createNode(registry, getAdapter(state.adapterId).defaultContainerType),
              label,
              style: { padding: 24 },
            }
          : createFrame(label)

      const usedNames = new Set(state.nodes.map((node) => node.label))
      const prefix = label.replace(/\s+\d+$/, '')
      let suffix = 1

      if (kind === 'overlay') {
        while (usedNames.has(screen.label)) {
          screen.label = `${prefix} ${suffix++}`
        }
      }

      if (kind === 'overlay' && overlay) {
        screen.overlay = overlay
      }

      state.nodes.push(screen)

      root.flow.screens.push({ nodeId: screen.id, kind })

      state.editingFlowScreenId = screen.id

      state.focusedContainerId = screen.id

      state.selectedFrameIds = []

      state.selectedNodeIds = kind === 'overlay' ? [screen.id] : []

      Object.assign(state, getNextHistory(state))
    })
