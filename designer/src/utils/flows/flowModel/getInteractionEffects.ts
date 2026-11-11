import type { DesignNode } from '@root/types/document'
import type { DesignInteraction } from '@root/types/preview'

import { getAllNodes } from './getAllNodes'
import { getFlowOwner } from './getFlowOwner'
import { getInitiallyOpenOverlayIds } from './getInitiallyOpenOverlayIds'
import type { FlowVisibilityEffect } from './types'

/** Shared by preview and export: one definition of every visibility transition. */
export const getInteractionEffects = (
  nodes: DesignNode[],
  rule: DesignInteraction,
): FlowVisibilityEffect[] => {
  const screens = getFlowOwner(nodes, rule.targetNodeId)?.flow?.screens ?? []

  if (rule.action === 'goTo') {
    return screens.some((screen) => screen.nodeId === rule.targetNodeId && screen.kind === 'screen')
      ? [
          { operation: 'hide', nodeIds: screens.map((screen) => screen.nodeId) },
          {
            operation: 'show',
            nodeIds: [rule.targetNodeId, ...getInitiallyOpenOverlayIds(nodes, rule.targetNodeId)],
          },
        ]
      : []
  }

  if (rule.action === 'openOverlay' || rule.action === 'closeOverlay') {
    if (
      !screens.some((screen) => screen.nodeId === rule.targetNodeId && screen.kind === 'overlay')
    ) {
      return []
    }

    const all = getAllNodes(nodes)

    const presentation =
      all.find((node) => node.id === rule.targetNodeId)?.overlay?.presentation ?? 'modal'

    return rule.action === 'openOverlay'
      ? [
          {
            operation: 'hide',
            nodeIds: screens
              .filter(
                (screen) =>
                  screen.kind === 'overlay' &&
                  (all.find((node) => node.id === screen.nodeId)?.overlay?.presentation ??
                    'modal') === presentation,
              )
              .map((screen) => screen.nodeId),
          },
          { operation: 'show', nodeIds: [rule.targetNodeId] },
        ]
      : [{ operation: 'hide', nodeIds: [rule.targetNodeId] }]
  }

  return [{ operation: rule.action, nodeIds: [rule.targetNodeId] }]
}
