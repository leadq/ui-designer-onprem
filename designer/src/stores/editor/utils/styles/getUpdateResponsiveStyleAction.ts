import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateComponentContract } from '@root/utils/designer/componentContract'
import { findNode } from '@root/utils/nodes'
import { findParent } from '@root/utils/nodes/findParent'

import { getNextHistory } from '../getNextHistory'

import { getNodeStyleEdit } from './getNodeStyleEdit'

export const getUpdateResponsiveStyleAction =
  (set: EditorStoreSet): EditorActions['updateResponsiveStyle'] =>
  (id, breakpoint, style) =>
    set((state) => {
      const node = findNode(state.nodes, id)

      if (!node || node.type === 'designerFrame' || node.type === 'designerFlow') {
        return
      }

      if (breakpoint === 'xl') {
        node.style = getNodeStyleEdit(node, 'xl', style)
      } else {
        if (!node.responsiveStyles) {
          node.responsiveStyles = {}
        }

        node.responsiveStyles[breakpoint] = getNodeStyleEdit(node, breakpoint, style)
      }

      validateComponentContract([node], registry, findParent(state.nodes, node.id) ?? undefined)

      const historyUpdate = getNextHistory(state)

      state.history = historyUpdate.history

      state.historyIndex = historyUpdate.historyIndex
    })
