import type { CSSProperties } from 'react'

import { isFollowsParentFlexAxis } from './isFollowsParentFlexAxis'
import type { SizeAxis } from './types'

export const getContentSizeStyle = (
  axis: SizeAxis,
  parentStyle?: CSSProperties,
): Partial<CSSProperties> => ({
  [axis === 'horizontal' ? 'width' : 'height']: 'auto',
  ...(isFollowsParentFlexAxis(axis, parentStyle) ? { flexBasis: 'auto', flexGrow: 0 } : {}),
})
