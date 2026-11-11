import type { CSSProperties } from 'react'

const isFlex = (style: CSSProperties): boolean =>
  style.display === 'flex' || style.display === 'inline-flex'

const isGrid = (style: CSSProperties): boolean =>
  style.display === 'grid' || style.display === 'inline-grid'

/** 100% is the existing inspector's Fill representation; resolve against the current parent. */
export const getRemainingSpaceStyle = (
  style: CSSProperties,
  parentStyle?: CSSProperties,
  isContainer = false,
): CSSProperties => {
  const result = { ...style }
  const isHorizontalFill = style.width === '100%'
  const isVerticalFill = style.height === '100%'

  if (!isHorizontalFill && !isVerticalFill) {
    return result
  }

  if (parentStyle && isFlex(parentStyle)) {
    const isRow = !(parentStyle.flexDirection ?? 'row').startsWith('column')

    if (isRow ? isHorizontalFill : isVerticalFill) {
      result[isRow ? 'width' : 'height'] = 'auto'

      result.flexGrow = 1

      result.flexShrink = 1

      // Columns retain intrinsic content height so a minimum-height frame can grow.
      result.flexBasis = isRow ? 0 : 'auto'
    }

    if (isRow ? isVerticalFill : isHorizontalFill) {
      // Auto cross-axis margins disable stretch. Retain percentage sizing in that case
      // so a bounded fill item can stay wide and center the remaining space around it.
      const hasAutoMargin = isRow
        ? style.marginTop === 'auto' || style.marginBottom === 'auto'
        : style.marginLeft === 'auto' || style.marginRight === 'auto'

      const hasAutoShorthand = typeof style.margin === 'string' && style.margin.includes('auto')

      result[isRow ? 'height' : 'width'] = hasAutoMargin || hasAutoShorthand ? '100%' : 'auto'

      if (hasAutoMargin || hasAutoShorthand) {
        result.boxSizing = 'border-box'
      }

      result.alignSelf = 'stretch'
    }
  } else if (parentStyle && isGrid(parentStyle)) {
    if (isHorizontalFill) {
      result.width = 'auto'

      result.justifySelf = 'stretch'
    }

    if (isVerticalFill) {
      result.height = 'auto'

      result.alignSelf = 'stretch'
    }
  } else if (isHorizontalFill) {
    // Containers subtract margins naturally; inline native controls retain their display contract.
    result.width =
      isContainer || ['block', 'flow-root', 'flex', 'grid'].includes(style.display ?? '')
        ? 'auto'
        : '100%'

    result.boxSizing = 'border-box'

    if (result.display === 'inline-flex') {
      result.display = 'flex'
    } else if (result.display === 'inline-grid') {
      result.display = 'grid'
    }
  }

  return result
}
