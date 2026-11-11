import type { DesignNode } from '@root/types/document'
import type { PreviewValue } from '@root/types/preview'

import { getConditionNodes } from '../conditionModel'

import { getToggleTargetIds } from './getToggleTargetIds'
import { isToggleVisible } from './isToggleVisible'

export const getToggleVisibility = (
  nodes: DesignNode[],
  values: Record<string, PreviewValue>,
): Record<string, boolean> =>
  Object.fromEntries(
    getConditionNodes(nodes).flatMap((node) =>
      getToggleTargetIds(node.toggleBinding).map((id) => [
        id,
        (values[node.id] === true) === isToggleVisible(node.toggleBinding, id),
      ]),
    ),
  )
