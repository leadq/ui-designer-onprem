import type { DesignNode } from '@root/types/document'
import { reconcileStateRules } from '@root/utils/conditions/componentState'
import { getConditionNodes, getRuleBranches } from '@root/utils/conditions/conditionModel'
import { reconcileToggleBindings } from '@root/utils/conditions/toggleBindings'

import { getAllNodes } from './getAllNodes'
import { getFlowOwner } from './getFlowOwner'

/** Repair references after delete/move, in the same history transaction. */
export const reconcileFlows = (nodes: DesignNode[]): void => {
  reconcileToggleBindings(nodes)

  reconcileStateRules(nodes)

  const all = getAllNodes(nodes)
  const ids = new Set(all.map((node) => node.id))
  const uniqueIds = new Set(getConditionNodes(nodes).map((node) => node.id))

  for (const node of all) {
    if (
      node.textBinding &&
      (!uniqueIds.has(node.id) || !uniqueIds.has(node.textBinding.sourceNodeId))
    ) {
      delete node.textBinding
    }

    if (node.flow) {
      node.flow.screens = node.flow.screens.filter((screen) =>
        (node.flow?.layout === 'root' ? nodes : node.children).some(
          (child) => child.id === screen.nodeId && !child.flow,
        ),
      )

      if (
        !node.flow.screens.some(
          (screen) => screen.kind === 'screen' && screen.nodeId === node.flow?.startScreenId,
        )
      ) {
        node.flow.startScreenId =
          node.flow.screens.find((screen) => screen.kind === 'screen')?.nodeId ?? ''
      }
    }

    if (node.overlay) {
      const flow = getFlowOwner(nodes, node.id)?.flow

      if (
        !flow?.screens.some(
          (screen) => screen.nodeId === node.overlay?.ownerFrameId && screen.kind === 'screen',
        )
      ) {
        if (flow?.startScreenId) {
          node.overlay = {
            ...node.overlay,
            ownerFrameId: flow.startScreenId,
            initiallyOpen: false,
          }
        } else {
          delete node.overlay
        }
      }
    }

    node.interactions = node.interactions?.filter((interaction) => {
      if (
        interaction.condition?.source.kind === 'field' &&
        !ids.has(interaction.condition.source.nodeId)
      ) {
        return false
      }

      return getRuleBranches(interaction).every((branch) => {
        if (['show', 'hide', 'toggle'].includes(branch.action)) {
          return true
        }

        const owner = getFlowOwner(nodes, branch.targetNodeId)

        return (
          ids.has(branch.targetNodeId) &&
          Boolean(
            owner?.flow?.screens.some(
              (screen) =>
                screen.nodeId === branch.targetNodeId &&
                screen.kind === (branch.action === 'goTo' ? 'screen' : 'overlay'),
            ),
          )
        )
      })
    })
  }
}
