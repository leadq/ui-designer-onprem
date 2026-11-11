import type { DesignNode } from '@root/types/document'

export const hasRootFrames = (nodes: DesignNode[]): boolean =>
  nodes.some((node) => node.flow?.layout === 'root')
