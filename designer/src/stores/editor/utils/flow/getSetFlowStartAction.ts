import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getSetFlowStartAction =
  (set: EditorStoreSet): EditorActions['setFlowStart'] =>
  (flowId, screenId) =>
    set((state) => {
      const root = findNode(state.nodes, flowId)

      if (
        !root?.flow?.screens.some(
          (screen) => screen.nodeId === screenId && screen.kind === 'screen',
        )
      ) {
        return
      }

      root.flow.startScreenId = screenId

      Object.assign(state, getNextHistory(state))
    })
