import type { DesignNode } from '@root/types/document'

/**
 * Checks if a node is a descendant of another node.
 */
export const isDescendant = (parent: DesignNode, childId: string): boolean => {
  if (parent.children.some((child) => child.id === childId || isDescendant(child, childId))) {
    return true
  }

  if (parent.slots) {
    for (const slotNodes of Object.values(parent.slots)) {
      if (slotNodes.some((child) => child.id === childId || isDescendant(child, childId))) {
        return true
      }
    }
  }

  return false
}
