import type { DesignNode } from '@root/types/document'

import { getFrameForNode } from './getFrameForNode'

export const getFrameInsertionTarget = (
  nodes: DesignNode[],
  activeId: string | null,
): string | undefined => {
  const active = activeId ? getFrameForNode(nodes, activeId) : null

  return active?.id ?? nodes.find((node) => node.flow?.layout === 'root')?.flow?.startScreenId
}
