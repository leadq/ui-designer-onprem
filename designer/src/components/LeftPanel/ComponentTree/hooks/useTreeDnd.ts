import { useContext } from 'react'

import { TreeDndContext, type TreeDndContextType } from '../contexts/TreeDndContext'

export const useTreeDnd = (): TreeDndContextType => {
  const context = useContext(TreeDndContext)

  if (!context) {
    throw new Error('useTreeDnd must be used within a TreeDndProvider')
  }

  return context
}
