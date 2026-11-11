import type { CSSProperties } from 'react'

import { getNodeElement } from './getNodeElement'

export const getNodeLayoutStyle = (id: string): CSSProperties | undefined => {
  const element = getNodeElement(id)

  if (!element) {
    return undefined
  }

  const style = getComputedStyle(element)

  return {
    display: style.display,
    flexDirection: style.flexDirection as CSSProperties['flexDirection'],
  }
}
