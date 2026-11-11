import type { ReactNode } from 'react'
import { IconEditingProvider } from '@root/contexts/IconEditingContext'
import { useEditorStore } from '@root/stores/editor'

const DEFAULT_CANVAS_WIDTH = 1024

export interface CanvasIconEditingProps {
  children: ReactNode
}

export const CanvasIconEditing = ({ children }: CanvasIconEditingProps) => {
  const selectedIds = useEditorStore((state) => state.selectedNodeIds)
  const width = useEditorStore((state) => state.canvasWidth)

  const handleChange = (id: string, value: string) =>
    useEditorStore.getState().updateMultipleProps([id], 'glyph', value)

  return (
    <IconEditingProvider
      selectedIds={selectedIds}
      width={width ?? DEFAULT_CANVAS_WIDTH}
      onChange={handleChange}
    >
      {children}
    </IconEditingProvider>
  )
}
