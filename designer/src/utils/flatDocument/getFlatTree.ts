import type { DesignNode } from '@root/types/document'

import type { FlatNode, FlatTree } from './types'

/** A derived index. The nested document remains the editor's source of truth. */
export const getFlatTree = (nodes: DesignNode[]): FlatTree => {
  const nodesById: Record<string, FlatNode> = Object.create(null)

  const visit = (items: DesignNode[], parentId: string | null, slotKey: string | null) => {
    items.forEach((node, index) => {
      if (Object.hasOwn(nodesById, node.id)) {
        throw new Error(`Duplicate node ID: ${node.id}`)
      }

      const { children, slots, ...data } = node

      nodesById[node.id] = {
        ...data,
        parentId,
        slotKey,
        index,
        childIds: children.map((child) => child.id),
        ...(slots
          ? {
              slotChildIds: Object.fromEntries(
                Object.entries(slots).map(([key, items]) => [key, items.map((item) => item.id)]),
              ),
            }
          : {}),
      }

      visit(children, node.id, null)

      Object.entries(slots ?? {}).forEach(([key, items]) => {
        visit(items, node.id, key)
      })
    })
  }

  visit(nodes, null, null)

  return { rootIds: nodes.map((node) => node.id), nodesById }
}
