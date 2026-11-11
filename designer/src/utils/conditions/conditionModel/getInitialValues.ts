import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import type { PreviewValue } from '@root/types/preview'

import { getConditionNodes } from './getConditionNodes'

export const getInitialValues = (
  nodes: DesignNode[],
  registry: Registry,
): Record<string, PreviewValue> =>
  Object.fromEntries(
    getConditionNodes(nodes).flatMap((node) => {
      const binding = registry[node.type]?.previewValue

      if (!binding) {
        return []
      }

      const value = [
        node.props[binding.prop],
        node.props[binding.defaultProp],
        registry[node.type].defaultProps[binding.prop],
        registry[node.type].defaultProps[binding.defaultProp],
        binding.emptyValue,
      ].find((value) => value !== undefined)

      return value === null ||
        ['string', 'boolean'].includes(typeof value) ||
        (typeof value === 'number' && Number.isFinite(value))
        ? [[node.id, value as PreviewValue]]
        : []
    }),
  )
