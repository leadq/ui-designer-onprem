import type { DesignNode } from '@root/types/document'

export const getFrameIds = (nodes: DesignNode[]): Set<string> =>
  new Set(nodes.flatMap((node) => node.flow?.screens.map((screen) => screen.nodeId) ?? []))
