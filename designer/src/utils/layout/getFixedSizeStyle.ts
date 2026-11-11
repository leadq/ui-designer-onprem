import type { CSSProperties } from 'react'

import { getContentSizeStyle } from './getContentSizeStyle'
import type { SizeAxis } from './types'

export const getFixedSizeStyle = (
  axis: SizeAxis,
  pixels: number,
  parentStyle?: CSSProperties,
): Partial<CSSProperties> => ({
  ...getContentSizeStyle(axis, parentStyle),
  [axis === 'horizontal' ? 'width' : 'height']: `${Math.round(pixels)}px`,
})
