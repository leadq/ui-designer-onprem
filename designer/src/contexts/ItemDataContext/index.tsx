import type { ReactNode } from 'react'

import { ItemDataContext } from './context'

export interface ItemDataProviderProps {
  item: Record<string, unknown> | null
  children: ReactNode
}

export const ItemDataProvider = ({ item, children }: ItemDataProviderProps) => (
  <ItemDataContext.Provider value={item}>{children}</ItemDataContext.Provider>
)
