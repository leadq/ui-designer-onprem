import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

import { getToggleScope } from './getToggleScope'
import { getToggleTargetIds } from './getToggleTargetIds'

export const getToggleTargets = (
  nodes: DesignNode[],
  sourceId: string,
  shouldAllowOwned = false,
): DesignNode[] => {
  const all = getConditionNodes(nodes)
  const scope = getToggleScope(nodes, sourceId)

  const frameIds = new Set(
    all.flatMap((node) => node.flow?.screens.map((screen) => screen.nodeId) ?? []),
  )

  const ownedIds = new Set(
    all
      .filter((node) => node.id !== sourceId)
      .flatMap((node) => getToggleTargetIds(node.toggleBinding)),
  )

  return all.filter(
    (node) =>
      !node.flow &&
      !node.overlay &&
      !frameIds.has(node.id) &&
      (shouldAllowOwned || !ownedIds.has(node.id)) &&
      !getConditionNodes([node]).some((child) => child.id === sourceId) &&
      getToggleScope(nodes, node.id) === scope,
  )
}
