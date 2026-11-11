import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { getFlowOwner } from '@root/utils/flows/flowModel'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getSetOverlaySettingsAction =
  (set: EditorStoreSet): EditorActions['setOverlaySettings'] =>
  (nodeId, overlay) =>
    set((state) => {
      const node = findNode(state.nodes, nodeId)
      const flow = getFlowOwner(state.nodes, nodeId)?.flow

      if (
        !node ||
        !flow?.screens.some((screen) => screen.nodeId === nodeId && screen.kind === 'overlay') ||
        !flow.screens.some(
          (screen) => screen.nodeId === overlay.ownerFrameId && screen.kind === 'screen',
        )
      ) {
        return
      }

      node.overlay = overlay

      Object.assign(state, getNextHistory(state))
    })
