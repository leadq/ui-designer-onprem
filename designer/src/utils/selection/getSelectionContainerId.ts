import type { DesignNode } from '@root/types/document'
import { findParent, isDescendant } from '@root/utils/nodes'

/** The editing scope must contain every selected node, never a previous selection. */
export const getSelectionContainerId = (nodes: DesignNode[], ids: string[]): string | null => {
  if (!ids.length) {
    return null
  }

  let parent = findParent(nodes, ids[0])

  while (parent) {
    const candidate = parent

    if (ids.every((id) => isDescendant(candidate, id))) {
      return candidate.id
    }

    parent = findParent(nodes, candidate.id)
  }

  return null
}
