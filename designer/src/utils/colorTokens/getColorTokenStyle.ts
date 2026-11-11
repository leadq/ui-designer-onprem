import type { CSSProperties } from 'react'
import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getBreakpointForWidth } from '@root/utils/layout/getBreakpointForWidth'

import { getRegistryPalette } from './getRegistryPalette'
import { getStyleTokens } from './getStyleTokens'

export const getColorTokenStyle = (node: DesignNode, width: number | null, registry: Registry) => {
  const palette = getRegistryPalette(registry)
  const tokens = getStyleTokens(node, width === null ? 'xl' : getBreakpointForWidth(width))
  const style: CSSProperties = {}

  for (const property of ['backgroundColor', 'color', 'borderColor'] as const) {
    const token = palette.find((entry) => entry.id === tokens[property])

    if (token?.usages.includes(property)) {
      style[property] = token.cssValue
    }
  }

  return style
}
