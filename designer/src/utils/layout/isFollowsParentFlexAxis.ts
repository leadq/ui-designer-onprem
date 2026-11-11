import type { CSSProperties } from 'react'

import type { SizeAxis } from './types'

export const isFollowsParentFlexAxis = (axis: SizeAxis, parentStyle?: CSSProperties): boolean => {
  if (parentStyle?.display !== 'flex' && parentStyle?.display !== 'inline-flex') {
    return false
  }

  const parentDirection = parentStyle.flexDirection ?? 'row'

  return (
    (axis === 'horizontal' && parentDirection.startsWith('row')) ||
    (axis === 'vertical' && parentDirection.startsWith('column'))
  )
}
