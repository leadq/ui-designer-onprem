import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'

interface RenderTreeIndex {
  nodes: Map<string, DesignNode>
  owners: Map<string, DesignNode>
  frames: Set<string>
  windows: Set<string>
  cells: Set<string>
  collectionItems: Set<string>
}

// Only immutable, published store snapshots belong here; never use this index inside an Immer transaction.
const indexes = new WeakMap<DesignNode[], RenderTreeIndex>()

export const getRenderTreeIndex = (nodes: DesignNode[]): RenderTreeIndex => {
  const cached = indexes.get(nodes)

  if (cached) {
    return cached
  }

  const index: RenderTreeIndex = {
    nodes: new Map(),
    owners: new Map(),
    frames: new Set(),
    windows: new Set(),
    cells: new Set(),
    collectionItems: new Set(),
  }

  nodes.forEach((node) => {
    node.flow?.screens.forEach((screen) => {
      index.frames.add(screen.nodeId)
    })
  })

  const visit = (items: DesignNode[]): void => {
    for (const node of items) {
      index.nodes.set(node.id, node)

      node.flow?.screens.forEach((screen) => {
        if (!index.owners.has(screen.nodeId)) {
          index.owners.set(screen.nodeId, node)
        }

        if (screen.kind === 'overlay') {
          index.windows.add(screen.nodeId)
        }
      })

      if (registry[node.type]?.collectionItem) {
        index.collectionItems.add(node.id)
      }

      node.slots?.cellContents?.forEach((cell) => {
        index.cells.add(cell.id)
      })

      visit(node.children)

      Object.values(node.slots ?? {}).forEach(visit)
    }
  }

  visit(nodes)

  indexes.set(nodes, index)

  return index
}
