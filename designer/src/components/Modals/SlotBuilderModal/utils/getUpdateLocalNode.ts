import type { DesignNode } from '@root/types/document'

// Helper to update a local node recursively
export const getUpdateLocalNode = (
  nodes: DesignNode[],
  id: string,
  updater: (node: DesignNode) => void,
): DesignNode[] =>
  nodes.map((node) => {
    if (node.id === id) {
      const cloned = { ...node, props: { ...node.props }, style: { ...node.style } }

      updater(cloned)

      return cloned
    }

    if (node.children.length > 0) {
      return { ...node, children: getUpdateLocalNode(node.children, id, updater) }
    }

    return node
  })
