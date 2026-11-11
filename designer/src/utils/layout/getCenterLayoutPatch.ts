import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getAlignmentLayoutPatch } from './getAlignmentLayoutPatch'
import type { SizeAxis } from './types'

export const getCenterLayoutPatch = (
  node: DesignNode,
  parent: DesignNode,
  axis: SizeAxis,
  width: number | null,
  componentRegistry: Registry,
) => getAlignmentLayoutPatch(node, parent, axis, width, componentRegistry)
