import type { CSSProperties } from 'react'

import { getSpacingSideValue } from './getSpacingSideValue'

/** React DOM receives only longhands, including for legacy mixed documents. */
export const getRenderSpacingStyle = (style: CSSProperties): CSSProperties => {
  const result = Object.fromEntries(
    Object.entries(style).filter(([, value]) => value !== undefined),
  ) as CSSProperties

  for (const kind of ['padding', 'margin'] as const) {
    if (result[kind] === undefined) {
      continue
    }

    for (const [side, suffix] of [
      ['top', 'Top'],
      ['right', 'Right'],
      ['bottom', 'Bottom'],
      ['left', 'Left'],
    ] as const) {
      Object.assign(result, { [`${kind}${suffix}`]: getSpacingSideValue(style, kind, side) })
    }

    delete result[kind]
  }

  return result
}
