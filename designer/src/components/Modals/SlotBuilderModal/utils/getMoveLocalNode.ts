import type { DesignNode } from '@root/types/document'

// Helper to move a local node up/down within its array
export const getMoveLocalNode = (
  nodes: DesignNode[],
  id: string,
  direction: 'up' | 'down',
): DesignNode[] => {
  const rootIndex = nodes.findIndex((node) => node.id === id)

  if (rootIndex !== -1) {
    const targetIndex = direction === 'up' ? rootIndex - 1 : rootIndex + 1

    if (targetIndex >= 0 && targetIndex < nodes.length) {
      const cloned = [...nodes]
      const temp = cloned[rootIndex]

      cloned[rootIndex] = cloned[targetIndex]

      cloned[targetIndex] = temp

      return cloned
    }

    return nodes
  }

  return nodes.map((node) => {
    if (node.children.length > 0) {
      const childIndex = node.children.findIndex((node) => node.id === id)

      if (childIndex !== -1) {
        const targetIndex = direction === 'up' ? childIndex - 1 : childIndex + 1

        if (targetIndex >= 0 && targetIndex < node.children.length) {
          const clonedChildren = [...node.children]
          const temp = clonedChildren[childIndex]

          clonedChildren[childIndex] = clonedChildren[targetIndex]

          clonedChildren[targetIndex] = temp

          return { ...node, children: clonedChildren }
        }
      }

      return { ...node, children: getMoveLocalNode(node.children, id, direction) }
    }

    return node
  })
}
