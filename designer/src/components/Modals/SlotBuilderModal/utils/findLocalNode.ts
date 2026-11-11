import type { DesignNode } from '@root/types/document'

// Helper to search local nodes by ID
export const findLocalNode = (nodes: DesignNode[], id: string): DesignNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    const found = findLocalNode(node.children, id)

    if (found) {
      return found
    }
  }

  return null
}
