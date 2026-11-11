import { createContext } from 'react'

export interface IconEditingValue {
  selectedIds: string[]
  width?: number
  onChange: (id: string, value: string) => void
}

export const IconEditingContext = createContext<IconEditingValue | null>(null)
