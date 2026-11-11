import type { DesignNode } from '@root/types/document'

/** Selecting a container covers its full subtree. An empty frame requires its explicit frame-header selection control. */
export const getCompleteFrameIds = (nodes: DesignNode[], selectedIds: string[]) => {
  const selected = new Set(selectedIds)

  return nodes
    .filter(
      (node) =>
        node.type === 'designerFrame' &&
        node.children.length &&
        node.children.every((child) => selected.has(child.id)),
    )
    .map((node) => node.id)
}
