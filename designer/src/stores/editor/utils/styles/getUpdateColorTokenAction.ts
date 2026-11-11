import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateStyleTokens } from '@root/utils/colorTokens/validateStyleTokens'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getUpdateColorTokenAction =
  (set: EditorStoreSet): EditorActions['updateColorToken'] =>
  (ids, breakpoint, property, tokenId) =>
    set((state) => {
      let changed = false

      for (const id of ids) {
        const node = findNode(state.nodes, id)

        if (!node || ['designerFrame', 'designerFlow'].includes(node.type)) {
          continue
        }

        const layer =
          breakpoint === 'xl' ? node.styleTokens : node.responsiveStyleTokens?.[breakpoint]

        if (layer?.[property] === tokenId) {
          continue
        }

        const next = { ...layer }

        if (tokenId === undefined) {
          delete next[property]
        } else {
          next[property] = tokenId
        }

        if (breakpoint === 'xl') {
          node.styleTokens = next
        } else {
          node.responsiveStyleTokens = { ...node.responsiveStyleTokens, [breakpoint]: next }
        }

        validateStyleTokens(node, registry)

        changed = true
      }

      if (changed) {
        Object.assign(state, getNextHistory(state))
      }
    })
