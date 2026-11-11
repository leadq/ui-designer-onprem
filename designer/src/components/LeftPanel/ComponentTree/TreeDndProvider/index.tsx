import type { ReactNode } from 'react'

import { TreeDndContext } from '../contexts/TreeDndContext'
import { useTreeDndValue } from '../hooks/useTreeDndValue'

export interface TreeDndProviderProps {
  children: ReactNode
}

export const TreeDndProvider = ({ children }: TreeDndProviderProps) => {
  const value = useTreeDndValue()

  return <TreeDndContext.Provider value={value}>{children}</TreeDndContext.Provider>
}
