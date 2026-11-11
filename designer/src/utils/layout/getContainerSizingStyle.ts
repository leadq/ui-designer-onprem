import type { CSSProperties } from 'react'
import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getPropsAtWidth } from '@root/utils/responsive/getPropsAtWidth'

import { getStyleAtWidth } from './getStyleAtWidth'

/** Normal flow needs a column context to distribute remaining vertical space. */
export const getContainerSizingStyle = (
  node: DesignNode,
  width: number | null,
  componentRegistry: Registry,
): CSSProperties => {
  const meta = componentRegistry[node.type]

  const style = getStyleAtWidth(node, width, {
    ...meta?.defaultStyle,
    ...meta?.getDefaultLayoutStyle?.(getPropsAtWidth(node, width, meta)),
  })

  const hasVerticalFill = node.children.some(
    (child) =>
      getStyleAtWidth(child, width, componentRegistry[child.type]?.defaultStyle).height === '100%',
  )

  const hasCenteredFrameChild =
    node.type === 'designerFrame' &&
    node.children.some((child) => {
      const childStyle = getStyleAtWidth(child, width, componentRegistry[child.type]?.defaultStyle)

      return (
        childStyle.marginLeft === 'auto' ||
        childStyle.marginRight === 'auto' ||
        (childStyle.marginTop === 'auto' && childStyle.marginBottom === 'auto')
      )
    })

  if (
    (hasVerticalFill || hasCenteredFrameChild) &&
    (!style.display || ['block', 'flow-root'].includes(style.display))
  ) {
    return { ...style, display: 'flex', flexDirection: 'column' }
  }

  return style
}
