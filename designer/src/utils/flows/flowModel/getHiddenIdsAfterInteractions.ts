import type { DesignNode } from '@root/types/document'
import type { DesignInteraction } from '@root/types/preview'

import { getInteractionEffects } from './getInteractionEffects'

export const getHiddenIdsAfterInteractions = (
  nodes: DesignNode[],
  hidden: string[],
  interactions: DesignInteraction[],
): string[] => {
  const ids = new Set(hidden)

  for (const interaction of interactions) {
    for (const effect of getInteractionEffects(nodes, interaction)) {
      for (const id of effect.nodeIds) {
        if (effect.operation === 'hide' || (effect.operation === 'toggle' && !ids.has(id))) {
          ids.add(id)
        } else {
          ids.delete(id)
        }
      }
    }
  }

  return [...ids]
}
