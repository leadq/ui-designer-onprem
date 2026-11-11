import type { CSSProperties } from 'react'

import { getContentSizeStyle } from './getContentSizeStyle'
import type { SizeAxis } from './types'

export const getFillSizeStyle = (
  axis: SizeAxis,
  parentStyle?: CSSProperties,
): Partial<CSSProperties> =>
  // Preserve the axis intent; the renderer resolves it against the current parent.
  ({
    ...getContentSizeStyle(axis, parentStyle),
    [axis === 'horizontal' ? 'width' : 'height']: '100%',
  })
