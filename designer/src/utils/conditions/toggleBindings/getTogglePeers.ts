import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

export const getTogglePeers = (nodes: DesignNode[], id: string): string[] => {
  const all = getConditionNodes(nodes)
  const excludedIds = all.find((source) => source.id === id)?.toggleBinding?.exclusiveWith ?? []

  return all
    .filter(
      (node) =>
        node.id !== id &&
        (node.toggleBinding?.exclusiveWith.includes(id) || excludedIds.includes(node.id)),
    )
    .map((node) => node.id)
}
