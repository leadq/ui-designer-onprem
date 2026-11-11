import type { CSSProperties } from 'react'

export type SizeAxis = 'horizontal' | 'vertical'

export type SizeMode = 'content' | 'fixed' | 'fill'

export interface CenterLayoutPatch {
  style: CSSProperties
  parentStyle?: CSSProperties
}

export type LayoutAlignment = 'start' | 'center' | 'end'
