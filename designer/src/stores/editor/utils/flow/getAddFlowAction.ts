import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { createFrame, getFrameIds, promoteFlowFrames } from '@root/utils/frames/frameWorkspace'
import { createNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getAddFlowAction =
  (set: EditorStoreSet): EditorActions['addFlow'] =>
  (name, screenLabel) =>
    set((state) => {
      promoteFlowFrames(state.nodes)

      const root = createNode(registry, 'designerFlow')
      const screen = createFrame(screenLabel)

      root.label = name

      const frameIds = getFrameIds(state.nodes)
      const loose = state.nodes.filter((node) => !node.flow && !frameIds.has(node.id))

      screen.children = loose

      state.nodes = state.nodes.filter((node) => !loose.includes(node))

      root.flow = {
        layout: 'root',
        startScreenId: screen.id,
        screens: [{ nodeId: screen.id, kind: 'screen' }],
      }

      state.nodes.push(root, screen)

      state.editingFlowScreenId = screen.id

      state.focusedContainerId = screen.id

      state.selectedFrameIds = []

      state.selectedNodeIds = []

      Object.assign(state, getNextHistory(state))
    })
