import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

import { getToggleTargetIds } from './getToggleTargetIds'
import { isToggleVisible } from './isToggleVisible'

export const getToggleManifest = (nodes: DesignNode[]) => ({
  visibility: getConditionNodes(nodes).flatMap((node) =>
    getToggleTargetIds(node.toggleBinding).map((id) => ({
      sourceNodeId: node.id,
      targetNodeId: id,
      visibleWhen: isToggleVisible(node.toggleBinding, id),
      otherwise: 'hidden' as const,
    })),
  ),
  exclusions: [
    ...new Set(
      getConditionNodes(nodes).flatMap((node) =>
        (node.toggleBinding?.exclusiveWith ?? []).map((id) => JSON.stringify([node.id, id].sort())),
      ),
    ),
  ].map((pair) => ({
    nodeIds: JSON.parse(pair) as string[],
    policy: 'latest-enabled-wins' as const,
  })),
  precedence: 'bound-visibility-overrides-direct-visibility-for-target' as const,
  initialConflict: 'first-enabled-in-tree-order-wins' as const,
  implicitChanges: 'do-not-dispatch-change-rules' as const,
})
