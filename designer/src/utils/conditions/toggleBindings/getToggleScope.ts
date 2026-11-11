import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from '../conditionModel'

export const getToggleScope = (nodes: DesignNode[], id: string): string | undefined => {
  const visit = (items: DesignNode[], scope?: string): string | undefined => {
    for (const node of items) {
      if (node.id === id) {
        return scope
      }

      for (const child of node.children) {
        const found = visit(
          [child],
          node.flow?.screens.some((screen) => screen.nodeId === child.id) ? child.id : scope,
        )

        if (found !== undefined) {
          return found
        }
      }
    }

    return undefined
  }

  const frames = new Set(
    getConditionNodes(nodes).flatMap(
      (node) => node.flow?.screens.map((screen) => screen.nodeId) ?? [],
    ),
  )

  for (const node of nodes) {
    const found = visit([node], frames.has(node.id) ? node.id : undefined)

    if (found !== undefined) {
      return found
    }
  }

  return undefined
}
