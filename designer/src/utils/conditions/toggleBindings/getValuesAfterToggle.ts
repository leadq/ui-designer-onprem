import type { DesignNode } from '@root/types/document'
import type { PreviewValue } from '@root/types/preview'

import { getTogglePeers } from './getTogglePeers'

export const getValuesAfterToggle = (
  nodes: DesignNode[],
  values: Record<string, PreviewValue>,
  id: string,
  value: PreviewValue,
): Record<string, PreviewValue> => {
  const next = { ...values, [id]: value }

  if (value === true) {
    for (const peer of getTogglePeers(nodes, id)) {
      next[peer] = false
    }
  }

  return next
}
