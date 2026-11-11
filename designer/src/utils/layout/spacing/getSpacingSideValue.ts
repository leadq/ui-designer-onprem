import type { CSSProperties } from 'react'

import type { SpacingKind, SpacingSide } from './types'

// Split CSS shorthand without splitting spaces inside calc()/var().
const getSpacingTokens = (value: string): string[] => {
  const tokens: string[] = []
  let depth = 0
  let token = ''

  for (const character of value.trim()) {
    if (character === '(') {
      depth += 1
    }

    if (character === ')') {
      depth -= 1
    }

    if (/\s/.test(character) && depth === 0) {
      if (token) {
        tokens.push(token)
      }

      token = ''
    } else {
      token += character
    }
  }

  if (token) {
    tokens.push(token)
  }

  return tokens
}

export const getSpacingSideValue = (
  style: CSSProperties,
  kind: SpacingKind,
  side: SpacingSide,
): string => {
  const keys = { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' } as const
  const explicit = style[`${kind}${keys[side]}`]
  const tokens = getSpacingTokens(String(style[kind] ?? '0'))
  const [top = '0', right = top, bottom = top, left = right] = tokens
  const value = explicit ?? { top, right, bottom, left }[side]

  return typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value
}
