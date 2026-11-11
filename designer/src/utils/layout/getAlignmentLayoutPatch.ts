import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getPropsAtWidth } from '@root/utils/responsive/getPropsAtWidth'

import { getContainerSizingStyle } from './getContainerSizingStyle'
import { getStyleAtWidth } from './getStyleAtWidth'
import type { CenterLayoutPatch, LayoutAlignment, SizeAxis } from './types'

/** Align in available space without changing sibling styles or the node tree. */
export const getAlignmentLayoutPatch = (
  node: DesignNode,
  parent: DesignNode,
  axis: SizeAxis,
  width: number | null,
  componentRegistry: Registry,
  alignment: LayoutAlignment = 'center',
): CenterLayoutPatch | null => {
  // Slot wrappers are owned by adapters, not the slot owner's root layout.
  if (
    !parent.children.some((child) => child.id === node.id) ||
    node.overlay ||
    node.type === 'designerFrame' ||
    node.type === 'designerFlow'
  ) {
    return null
  }

  const style = getContainerSizingStyle(node, width, componentRegistry)
  const parentStyle = getContainerSizingStyle(parent, width, componentRegistry)
  const parentMeta = componentRegistry[parent.type]

  const authoredParentStyle = getStyleAtWidth(parent, width, {
    ...parentMeta?.defaultStyle,
    ...parentMeta?.getDefaultLayoutStyle?.(getPropsAtWidth(parent, width, parentMeta)),
  })

  if (style.position === 'absolute' || style.position === 'fixed') {
    return null
  }

  const isGrid = ['grid', 'inline-grid'].includes(parentStyle.display ?? '')
  const isFlex = ['flex', 'inline-flex'].includes(parentStyle.display ?? '')

  if (
    !isGrid &&
    !isFlex &&
    parentStyle.display &&
    !['block', 'flow-root'].includes(parentStyle.display)
  ) {
    return null
  }

  const isHorizontal = axis === 'horizontal'
  const isRow = isFlex && !(parentStyle.flexDirection ?? 'row').startsWith('column')
  const isMainAxis = !isGrid && isHorizontal === isRow
  const dimension = isHorizontal ? 'width' : 'height'

  const isNormalParent = !['grid', 'inline-grid', 'flex', 'inline-flex'].includes(
    authoredParentStyle.display ?? '',
  )

  const shouldPromoteParent = isNormalParent && parent.type !== 'designerFrame'

  return {
    style: {
      // A block container filled the row before promotion; retain its width and max-width cap.
      ...(isNormalParent &&
      componentRegistry[node.type]?.isContainer &&
      (!style.width || style.width === 'auto')
        ? { width: '100%' }
        : {}),
      ...(isHorizontal
        ? {
            marginLeft: alignment === 'start' ? '0px' : 'auto',
            marginRight: alignment === 'end' ? '0px' : 'auto',
          }
        : {
            marginTop: alignment === 'start' ? '0px' : 'auto',
            marginBottom: alignment === 'end' ? '0px' : 'auto',
          }),
      ...(style[dimension] === '100%' ? { [dimension]: 'auto' } : {}),
      ...(isMainAxis ? { flexGrow: 0, flexBasis: 'auto' } : {}),
      ...(isGrid ? (isHorizontal ? { justifySelf: alignment } : { alignSelf: alignment }) : {}),
    },
    ...(shouldPromoteParent ? { parentStyle: { display: 'flex', flexDirection: 'column' } } : {}),
  }
}
