import type { CSSProperties } from 'react'
import type { BuilderTranslationKey } from '@root/contexts/BuilderI18nContext/context'

export const PADDING_SIDES = [
  { key: 'paddingTop' as keyof CSSProperties, labelKey: 'stylePanel.top' as BuilderTranslationKey },
  {
    key: 'paddingRight' as keyof CSSProperties,
    labelKey: 'stylePanel.right' as BuilderTranslationKey,
  },
  {
    key: 'paddingBottom' as keyof CSSProperties,
    labelKey: 'stylePanel.bottom' as BuilderTranslationKey,
  },
  {
    key: 'paddingLeft' as keyof CSSProperties,
    labelKey: 'stylePanel.left' as BuilderTranslationKey,
  },
]

export const MARGIN_SIDES = [
  { key: 'marginTop' as keyof CSSProperties, labelKey: 'stylePanel.top' as BuilderTranslationKey },
  {
    key: 'marginRight' as keyof CSSProperties,
    labelKey: 'stylePanel.right' as BuilderTranslationKey,
  },
  {
    key: 'marginBottom' as keyof CSSProperties,
    labelKey: 'stylePanel.bottom' as BuilderTranslationKey,
  },
  {
    key: 'marginLeft' as keyof CSSProperties,
    labelKey: 'stylePanel.left' as BuilderTranslationKey,
  },
]
