export type FloatingSide = 'top' | 'right' | 'bottom' | 'left'

export type FloatingPosition = FloatingSide | `${FloatingSide}-${'start' | 'end'}`

/** Public editor placement stays independent of the popup implementation. */
export const getFloatingPosition = (position: FloatingPosition) => {
  const [side, alignment] = position.split('-')

  return {
    side: side as FloatingSide,
    align: (alignment ?? 'center') as 'start' | 'center' | 'end',
  }
}
