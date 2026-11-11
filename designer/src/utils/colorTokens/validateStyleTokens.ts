import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getRegistryPalette } from './getRegistryPalette'

export const validateStyleTokens = (node: DesignNode, registry: Registry) => {
  const palette = getRegistryPalette(registry)

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value)

  const validate = (layer: unknown) => {
    if (!isRecord(layer) || ['designerFrame', 'designerFlow'].includes(node.type)) {
      throw new Error(`${node.id}: invalid styleTokens`)
    }

    for (const [property, id] of Object.entries(layer)) {
      const token = palette.find((entry) => entry.id === id)

      if (!token || !token.usages.some((usage) => usage === property)) {
        throw new Error(`${node.id}: unsupported color token ${String(id)} for ${property}`)
      }
    }
  }

  if (node.styleTokens !== undefined) {
    validate(node.styleTokens)
  }

  if (node.responsiveStyleTokens !== undefined) {
    if (!isRecord(node.responsiveStyleTokens)) {
      throw new Error(`${node.id}: invalid responsiveStyleTokens`)
    }

    for (const [key, layer] of Object.entries(node.responsiveStyleTokens)) {
      if (!['wide', 'lg', 'md', 'sm', 'xs'].includes(key)) {
        throw new Error(`${node.id}: invalid color breakpoint ${key}`)
      }

      validate(layer)
    }
  }
}
