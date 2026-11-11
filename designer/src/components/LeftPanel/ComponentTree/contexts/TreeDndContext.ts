import { createContext, type DragEvent } from 'react'

export interface DropIndicator {
  targetId: string
  position: 'before' | 'after' | 'inside'
}

export interface TreeDndContextType {
  draggingId: string | null
  dropIndicator: DropIndicator | null
  handleRowDragStart: (nodeId: string, e: DragEvent) => void
  handleRowDragOver: (nodeId: string, isContainer: boolean, e: DragEvent) => void
  handleRowDrop: (e: DragEvent) => void
  handleClearDropIndicator: (event?: DragEvent) => void
  handleRowDragEnd: () => void
}

export const TreeDndContext = createContext<TreeDndContextType | undefined>(undefined)
