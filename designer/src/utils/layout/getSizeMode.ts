import type { CSSProperties } from 'react'

import { isFollowsParentFlexAxis } from './isFollowsParentFlexAxis'
import type { SizeAxis, SizeMode } from './types'

export const getSizeMode = (
  style: CSSProperties,
  axis: SizeAxis,
  parentStyle?: CSSProperties,
): SizeMode => {
  const value = axis === 'horizontal' ? style.width : style.height

  if (value === '100%' || (style.flexGrow === 1 && isFollowsParentFlexAxis(axis, parentStyle))) {
    return 'fill'
  }

  if (value === undefined || value === 'auto' || value === 'fit-content') {
    return 'content'
  }

  return 'fixed'
}
