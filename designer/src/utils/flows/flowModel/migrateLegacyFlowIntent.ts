import type { DesignNode } from '@root/types/document'

import { getAllNodes } from './getAllNodes'
import { getContainingScreen } from './getContainingScreen'
import { getFlowOwner } from './getFlowOwner'

/** Upgrade the old collection-wide intent once; never infer intent for new untyped links. */
export const migrateLegacyFlowIntent = (nodes: DesignNode[]): void => {
  const all = getAllNodes(nodes)

  for (const source of all) {
    if (!source.interactions?.some((rule) => rule.action === 'goTo' && !rule.intent)) {
      continue
    }

    const screen = getContainingScreen(nodes, source.id)
    const kind = screen ? getFlowOwner(nodes, screen.id)?.flow?.kind : undefined

    for (const rule of source.interactions ?? []) {
      if (rule.action === 'goTo' && !rule.intent && kind) {
        rule.intent = kind === 'form' ? 'formStep' : 'navigation'
      }
    }
  }

  all.forEach((node) => {
    if (node.flow) {
      delete node.flow.kind
    }
  })
}
