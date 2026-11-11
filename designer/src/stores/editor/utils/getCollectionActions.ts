import { registry } from '@root/registry'
import { getEditedCollection } from '@root/utils/collectionAuthoring/getEditedCollection'
import { validateComponentContract } from '@root/utils/designer/componentContract/validateComponentContract'
import { findNode, findParent } from '@root/utils/nodes'

import type { EditorActions, EditorStoreSet } from '../types'

import { getNextHistory } from './getNextHistory'

export const getCollectionActions = (
  set: EditorStoreSet,
): Pick<EditorActions, 'editCollection'> => ({
  editCollection: (id, edit) =>
    set((state) => {
      const node = findNode(state.nodes, id)

      if (!node) {
        return
      }

      const next = getEditedCollection(node, edit, registry, state.slotComponents)

      if (next === node || JSON.stringify(next) === JSON.stringify(node)) {
        return
      }

      validateComponentContract([next], registry, findParent(state.nodes, id) ?? undefined)

      const added = next.children.find(
        (item) => !node.children.some((previous) => previous.id === item.id),
      )

      const sourceIndex =
        'itemId' in edit ? node.children.findIndex((item) => item.id === edit.itemId) : 0

      const selected =
        added ??
        next.children.find((item) => 'itemId' in edit && item.id === edit.itemId) ??
        next.children[Math.min(Math.max(sourceIndex, 0), next.children.length - 1)]

      Object.assign(node, next)

      if (edit.type !== 'initial') {
        state.selectedFrameIds = []

        state.selectedNodeIds = [selected?.id ?? id]

        state.focusedContainerId = selected?.id ?? null

        state.selectedTableColumnKey = null
      }

      Object.assign(state, getNextHistory(state))
    }),
})
