import type { DesignNode } from '@root/types/document'

import { getAllNodes } from './getAllNodes'
import { getInitiallyOpenOverlayIds } from './getInitiallyOpenOverlayIds'

export const getInitialHiddenIds = (nodes: DesignNode[]): string[] =>
  getAllNodes(nodes).flatMap((node) => [
    ...(node.prototypeHidden ? [node.id] : []),
    ...(node.flow?.screens
      .filter((screen) =>
        screen.kind === 'overlay'
          ? !getInitiallyOpenOverlayIds(nodes, node.flow!.startScreenId).includes(screen.nodeId)
          : screen.nodeId !== node.flow?.startScreenId,
      )
      .map((screen) => screen.nodeId) ?? []),
  ])
