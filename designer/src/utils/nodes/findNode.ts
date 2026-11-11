import type { DesignNode } from '@root/types/document'

/**
 * Finds a node by ID using recursive DFS.
 * Searches children and named slots.
 */
export const findNode = (nodes: DesignNode[], id: string): DesignNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    const found = findNode(node.children, id)

    if (found) {
      return found
    }

    // Search in slots
    if (node.slots) {
      for (const slotNodes of Object.values(node.slots)) {
        const slotFound = findNode(slotNodes, id)

        if (slotFound) {
          return slotFound
        }
      }
    }
  }

  return null
}
