import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

import { getToggleScope } from './getToggleScope'
import { getToggleTargetIds } from './getToggleTargetIds'
import { getToggleTargets } from './getToggleTargets'

export const reconcileToggleBindings = (nodes: DesignNode[]): void => {
  const all = getConditionNodes(nodes)
  const uniqueIds = new Set(all.map((node) => node.id))

  const clearRepeatedBindings = (items: DesignNode[]) => {
    for (const node of items) {
      if (!uniqueIds.has(node.id)) {
        delete node.toggleBinding
      }

      clearRepeatedBindings(node.children)

      Object.values(node.slots ?? {}).forEach(clearRepeatedBindings)
    }
  }

  clearRepeatedBindings(nodes)

  for (const node of all) {
    if (node.toggleBinding) {
      if (
        !getToggleTargets(nodes, node.id).some(
          (target) => target.id === node.toggleBinding?.visibleNodeId,
        )
      ) {
        delete node.toggleBinding.visibleNodeId
      }

      if (node.toggleBinding.visibleNodeIds) {
        node.toggleBinding.visibleNodeIds = node.toggleBinding.visibleNodeIds.filter((id) =>
          getToggleTargets(nodes, node.id).some((target) => target.id === id),
        )
      }

      if (node.toggleBinding.hiddenWhenCheckedNodeIds) {
        node.toggleBinding.hiddenWhenCheckedNodeIds =
          node.toggleBinding.hiddenWhenCheckedNodeIds.filter((id) =>
            getToggleTargetIds(node.toggleBinding).includes(id),
          )
      }

      node.toggleBinding.exclusiveWith = node.toggleBinding.exclusiveWith.filter(
        (id) =>
          all.some((peer) => peer.id === id) &&
          id !== node.id &&
          getToggleScope(nodes, id) === getToggleScope(nodes, node.id),
      )
    }
  }
}
