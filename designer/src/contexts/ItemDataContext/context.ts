import { createContext } from 'react'

export const ItemDataContext = createContext<Record<string, unknown> | null>(null)
