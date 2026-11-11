import type { DesignNode } from '@root/types/document'
import { findNode, findParent } from '@root/utils/nodes'

import { getFrameIds } from './getFrameIds'

export const getFrameForNode = (nodes: DesignNode[], id: string): DesignNode | null => {
  const ids = getFrameIds(nodes)
  let node = findNode(nodes, id)

  while (node && !ids.has(node.id)) {
    node = findParent(nodes, node.id)
  }

  return node
}
