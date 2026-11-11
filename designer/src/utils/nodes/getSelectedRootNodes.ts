import type { DesignNode } from '@root/types/document'

/** Keeps tree order and avoids saving a selected child twice with its parent. */
export const getSelectedRootNodes = (nodes: DesignNode[], selectedIds: string[]): DesignNode[] => {
  const selected = new Set(selectedIds)
  const roots: DesignNode[] = []

  const visit = (items: DesignNode[]): void => {
    for (const item of items) {
      if (selected.has(item.id)) {
        roots.push(item)

        continue
      }

      visit(item.children)

      Object.values(item.slots ?? {}).forEach(visit)
    }
  }

  visit(nodes)

  return roots
}
