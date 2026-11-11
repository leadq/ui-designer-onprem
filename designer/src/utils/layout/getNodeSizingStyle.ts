import type { CSSProperties } from 'react'
import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getColorTokenStyle } from '@root/utils/colorTokens/getColorTokenStyle'

import { getRenderSpacingStyle } from './spacing/getRenderSpacingStyle'
import { getContainerSizingStyle } from './getContainerSizingStyle'
import { getRemainingSpaceStyle } from './getRemainingSpaceStyle'

export const getNodeSizingStyle = (
  node: DesignNode,
  parent: DesignNode | undefined | null,
  width: number | null,
  componentRegistry: Registry,
): CSSProperties =>
  getRenderSpacingStyle(
    getRemainingSpaceStyle(
      {
        ...getContainerSizingStyle(node, width, componentRegistry),
        ...getColorTokenStyle(node, width, componentRegistry),
      },
      parent ? getContainerSizingStyle(parent, width, componentRegistry) : undefined,
      componentRegistry[node.type]?.isContainer,
    ),
  )
