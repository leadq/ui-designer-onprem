import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { findNode, findParent } from '@root/utils/nodes'

export const getCollectionContext = (nodes: DesignNode[], id: string, registry: Registry) => {
  let node = findNode(nodes, id)
  let item: DesignNode | null = null

  while (node) {
    if (registry[node.type]?.collection) {
      return { collection: node, item }
    }

    item = node

    node = findParent(nodes, node.id)
  }

  return null
}
