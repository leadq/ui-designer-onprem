import type { DesignNode } from '@root/types/document'

export const getAllNodes = (nodes: DesignNode[]): DesignNode[] =>
  nodes.flatMap((node) => [
    node,
    ...getAllNodes(node.children),
    ...Object.values(node.slots ?? {}).flatMap(getAllNodes),
  ])
