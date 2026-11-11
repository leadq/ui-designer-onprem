import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import type { DesignNode } from '@root/types/document'
import { getAlignmentLayoutPatch } from '@root/utils/layout/getAlignmentLayoutPatch'
import { findNode, findParent } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

import { getNodeStyleEdit } from './getNodeStyleEdit'

export const getAlignNodeAction =
  (set: EditorStoreSet): EditorActions['alignNode'] =>
  (id, axis, alignment) =>
    set((state) => {
      const node = findNode(state.nodes, id)
      const parent = findParent(state.nodes, id)

      if (!node || !parent) {
        return
      }

      const patch = getAlignmentLayoutPatch(
        node,
        parent,
        axis,
        state.canvasWidth,
        registry,
        alignment,
      )

      if (!patch) {
        return
      }

      const applyStyle = (target: DesignNode, style: React.CSSProperties) => {
        const nextStyle = getNodeStyleEdit(target, state.activeBreakpoint, style)

        if (state.activeBreakpoint === 'xl') {
          target.style = nextStyle
        } else {
          target.responsiveStyles = target.responsiveStyles ?? {}

          target.responsiveStyles[state.activeBreakpoint] = nextStyle
        }
      }

      if (patch.parentStyle) {
        applyStyle(parent, patch.parentStyle)
      }

      applyStyle(node, patch.style)

      const history = getNextHistory(state)

      state.history = history.history

      state.historyIndex = history.historyIndex
    })
