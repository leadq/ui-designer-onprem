import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateComponentContract } from '@root/utils/designer/componentContract'
import { findNode } from '@root/utils/nodes'
import { findParent } from '@root/utils/nodes/findParent'

import { getNextHistory } from '../getNextHistory'

export const getUpdatePropsAction =
  (set: EditorStoreSet): EditorActions['updateProps'] =>
  (id, key, value) =>
    set((state) => {
      const node = findNode(state.nodes, id)

      if (node && node.type !== 'designerFrame' && node.type !== 'designerFlow') {
        node.props[key] = value

        validateComponentContract([node], registry, findParent(state.nodes, node.id) ?? undefined)

        const historyUpdate = getNextHistory(state)

        state.history = historyUpdate.history

        state.historyIndex = historyUpdate.historyIndex
      }
    })
