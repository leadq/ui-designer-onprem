import type { DesignNode } from '@root/types/document'

import { getAllNodes } from './getAllNodes'

export const getInitiallyOpenOverlayIds = (nodes: DesignNode[], frameId: string): string[] =>
  getAllNodes(nodes)
    .filter(
      (node) =>
        node.overlay?.ownerFrameId === frameId &&
        node.overlay.initiallyOpen &&
        !node.prototypeHidden,
    )
    .map((node) => node.id)
