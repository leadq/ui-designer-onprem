import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateStateRules } from '@root/utils/conditions/componentState'
import { getToggleTargetIds } from '@root/utils/conditions/toggleBindings'
import { getAllNodes } from '@root/utils/flows/flowModel'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getSetComponentStateAction =
  (set: EditorStoreSet): EditorActions['setComponentState'] =>
  (nodeIds, property, rule, fallback) =>
    set((state) => {
      if (state.previewMode) {
        return
      }

      for (const id of nodeIds) {
        const node = findNode(state.nodes, id)

        if (!node) {
          continue
        }

        node.stateRules = { ...node.stateRules, [property]: rule }

        if (!rule) {
          delete node.stateRules[property]
        }

        if (!Object.keys(node.stateRules).length) {
          delete node.stateRules
        }

        if (property === 'visibleWhen') {
          node.prototypeHidden = !fallback || undefined

          for (const source of getAllNodes(state.nodes)) {
            if (source.toggleBinding) {
              source.toggleBinding.visibleNodeIds = getToggleTargetIds(source.toggleBinding).filter(
                (target) => target !== id,
              )

              delete source.toggleBinding.visibleNodeId

              if (source.toggleBinding.hiddenWhenCheckedNodeIds) {
                source.toggleBinding.hiddenWhenCheckedNodeIds =
                  source.toggleBinding.hiddenWhenCheckedNodeIds.filter((target) => target !== id)
              }
            }
          }
        } else {
          node.props.disabled = !fallback
        }
      }

      validateStateRules(state.nodes, registry)

      Object.assign(state, getNextHistory(state))
    })
