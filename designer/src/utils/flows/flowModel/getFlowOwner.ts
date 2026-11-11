import type { DesignNode } from '@root/types/document'

import { getAllNodes } from './getAllNodes'

export const getFlowOwner = (nodes: DesignNode[], screenId: string): DesignNode | undefined =>
  getAllNodes(nodes).find((node) => node.flow?.screens.some((screen) => screen.nodeId === screenId))
