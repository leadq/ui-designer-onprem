import type { StackProps } from '../Stack'

export const getGapValue = (gap: StackProps['gap']) => {
  if (typeof gap === 'number') {
    return `${gap}px`
  }

  return gap ? `var(--designer-spacing-${gap})` : '0'
}
