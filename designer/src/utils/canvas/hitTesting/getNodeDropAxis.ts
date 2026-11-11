import type { DesignNode } from '@root/types/document'
import { findParent } from '@root/utils/nodes'

import { getNodeElement } from './getNodeElement'

export const getNodeDropAxis = (id: string, nodes: DesignNode[], viewId?: string): 'x' | 'y' => {
  const parent = findParent(nodes, id)

  const boundary = parent
    ? getNodeElement(parent.id, viewId)
    : document.getElementById('render-layer')

  let current = getNodeElement(id, viewId)?.parentElement

  while (current) {
    const style = getComputedStyle(current)

    if (
      (style.display === 'flex' || style.display === 'inline-flex') &&
      style.flexDirection.startsWith('row')
    ) {
      return 'x'
    }

    if (style.display === 'grid' && style.gridTemplateColumns.split(' ').length > 1) {
      return 'x'
    }

    if (current === boundary) {
      break
    }

    current = current.parentElement
  }

  return 'y'
}
