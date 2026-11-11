import type { DesignNode } from '@root/types/document'

/**
 * Finds the parent of a node by ID.
 */
export const findParent = (nodes: DesignNode[], id: string): DesignNode | null => {
  for (const node of nodes) {
    if (node.children.some((child) => child.id === id)) {
      return node
    }

    // Check if directly in slots of this node
    if (node.slots) {
      for (const slotNodes of Object.values(node.slots)) {
        if (slotNodes.some((child) => child.id === id)) {
          return node
        }
      }
    }

    const found = findParent(node.children, id)

    if (found) {
      return found
    }

    // Check slots recursively
    if (node.slots) {
      for (const slotNodes of Object.values(node.slots)) {
        const slotFound = findParent(slotNodes, id)

        if (slotFound) {
          return slotFound
        }
      }
    }
  }

  return null
}
