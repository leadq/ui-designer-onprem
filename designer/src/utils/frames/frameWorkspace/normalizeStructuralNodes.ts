import type { DesignNode } from '@root/types/document'
import { v4 as uuid } from 'uuid'

import { getFrameIds } from './getFrameIds'

/** Preserve legacy authored presentation in an actual child component, not on the screen context. */
export const normalizeStructuralNodes = (
  nodes: DesignNode[],
  legacyContainerType: string,
): void => {
  const ids = getFrameIds(nodes)

  for (const node of nodes) {
    if (node.flow?.layout === 'root') {
      node.type = 'designerFlow'

      node.props = {}

      node.style = {}

      delete node.responsiveStyles
    }

    if (!ids.has(node.id) || node.overlay || node.type === 'designerFrame') {
      continue
    }

    if (
      node.type !== legacyContainerType ||
      Object.keys(node.props).length ||
      Object.keys(node.style).length ||
      node.responsiveStyles ||
      node.styleTokens ||
      node.responsiveStyleTokens ||
      node.slots
    ) {
      const content: DesignNode = {
        id: uuid(),
        type: node.type,
        props: node.props,
        style: node.style,
        children: node.children,
        ...(node.responsiveStyles ? { responsiveStyles: node.responsiveStyles } : {}),
        ...(node.styleTokens ? { styleTokens: node.styleTokens } : {}),
        ...(node.responsiveStyleTokens
          ? { responsiveStyleTokens: node.responsiveStyleTokens }
          : {}),
        ...(node.slots ? { slots: node.slots } : {}),
      }

      node.children = [content]
    }

    node.type = 'designerFrame'

    node.props = {}

    node.style = {}

    delete node.responsiveStyles

    delete node.styleTokens

    delete node.responsiveStyleTokens

    delete node.slots
  }
}
