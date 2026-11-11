import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { findNode, findParent } from '@root/utils/nodes'

export const getDisclosureContext = (
  nodes: DesignNode[],
  nodeId: string,
  registry: Registry,
): DesignNode | null => {
  let node = findNode(nodes, nodeId)

  while (node) {
    if (registry[node.type]?.disclosure) {
      return node
    }

    node = findParent(nodes, node.id)
  }

  return null
}
