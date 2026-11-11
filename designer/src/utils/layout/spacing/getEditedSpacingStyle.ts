import type { CSSProperties } from 'react'

import { getCustomSpacingStyle } from './getCustomSpacingStyle'

/** UI edits select one spacing representation on the edited layer. */
export const getEditedSpacingStyle = (
  current: CSSProperties,
  effective: CSSProperties,
  patch: CSSProperties,
): CSSProperties => {
  const result = { ...current, ...patch }

  for (const kind of ['padding', 'margin'] as const) {
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map(
      (side) => `${kind}${side}` as keyof CSSProperties,
    )

    if (patch[kind] !== undefined) {
      for (const side of sides) {
        delete result[side]
      }
    } else if (sides.some((side) => Object.hasOwn(patch, side))) {
      let custom = { ...effective }

      for (const side of sides) {
        if (Object.hasOwn(patch, side)) {
          custom = {
            ...custom,
            ...getCustomSpacingStyle(
              custom,
              kind,
              side,
              patch[side] as string | number | undefined,
            ),
          }
        }
      }

      delete result[kind]

      for (const side of sides) {
        Object.assign(result, { [side]: custom[side] })
      }
    }
  }

  return Object.fromEntries(Object.entries(result).filter(([, value]) => value !== undefined))
}
