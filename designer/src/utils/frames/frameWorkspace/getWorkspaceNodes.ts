import type { DesignNode } from '@root/types/document'

export const getWorkspaceNodes = (nodes: DesignNode[]): DesignNode[] =>
  nodes.filter((node) => node.flow?.layout !== 'root')
