import type { DesignNode } from '@root/types/document'

import { getAllNodes } from './getAllNodes'

/** Resolve the nearest screen, including elements rendered inside inline slots. */
export const getContainingScreen = (
  nodes: DesignNode[],
  nodeId: string,
): DesignNode | undefined => {
  const all = getAllNodes(nodes)

  const screenIds = new Set(
    all.flatMap((node) => node.flow?.screens.map((screen) => screen.nodeId) ?? []),
  )

  return all
    .filter(
      (node) => screenIds.has(node.id) && getAllNodes([node]).some((child) => child.id === nodeId),
    )
    .at(-1)
}
