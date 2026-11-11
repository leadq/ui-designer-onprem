import type { DesignNode } from '@root/types/document'

// Helper to delete a local node recursively
export const getDeleteLocalNode = (nodes: DesignNode[], id: string): DesignNode[] =>
  nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children.length > 0) {
        return { ...node, children: getDeleteLocalNode(node.children, id) }
      }

      return node
    })
