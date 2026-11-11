import type { CSSProperties } from 'react'

import { getSpacingSideValue } from './getSpacingSideValue'
import type { SpacingKind } from './types'

export const getCustomSpacingStyle = (
  style: CSSProperties,
  kind: SpacingKind,
  side: keyof CSSProperties,
  value: string | number | undefined,
): Partial<CSSProperties> => ({
  [kind]: undefined,
  [`${kind}Top`]: getSpacingSideValue(style, kind, 'top'),
  [`${kind}Right`]: getSpacingSideValue(style, kind, 'right'),
  [`${kind}Bottom`]: getSpacingSideValue(style, kind, 'bottom'),
  [`${kind}Left`]: getSpacingSideValue(style, kind, 'left'),
  [side]: value ?? '0px',
})
