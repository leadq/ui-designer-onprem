import type { DesignNode } from '@root/types/document'
import { getFlowOwner } from '@root/utils/flows/flowModel'

export const hasWindowSettings = (nodes: DesignNode[], selected: DesignNode[]): boolean =>
  selected.length === 1 &&
  Boolean(
    getFlowOwner(nodes, selected[0].id)?.flow?.screens.some(
      (screen) => screen.nodeId === selected[0].id && screen.kind === 'overlay',
    ),
  )
