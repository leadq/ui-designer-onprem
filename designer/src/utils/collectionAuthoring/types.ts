import type { ReactNode } from 'react'

export interface CollectionEntry {
  id: string
  props: Record<string, unknown>
  content: ReactNode
}

export type CollectionEdit =
  { type: 'add' } | { type: 'copy' | 'remove' | 'up' | 'down' | 'initial'; itemId: string }
