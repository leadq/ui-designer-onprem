import { useCallback, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useCanvasSelection } from '@root/hooks/canvas/useCanvasSelection'
import { useEditorStore } from '@root/stores/editor'

import { Box } from '../common'
import { ActionEditorHost } from '../Flows/ActionEditorHost'
import { FlowToolbar } from '../Flows/FlowToolbar'
import { PreviewScenarios } from '../Flows/PreviewScenarios'
import { NoteEditorModal } from '../Modals/NoteEditorModal'
import { OverlayLayer } from '../Overlay/OverlayLayer'
import { ReferenceWorkspace } from '../References/ReferenceWorkspace'

import { CanvasContextMenu } from './ContextMenu/CanvasContextMenu'
import { ResponsiveToolbar } from './ResponsiveToolbar/ResponsiveToolbar'
import { CanvasWorkspace } from './CanvasWorkspace'
import { CanvasZoomControls } from './CanvasZoomControls'
import { CollectionEditingLayer } from './CollectionEditingLayer'
import { TableEditingLayer } from './TableEditingLayer'

import styles from './styles.module.scss'

export interface CanvasProps {
  onManageBehaviors: () => void
}

export const Canvas = ({ onManageBehaviors }: CanvasProps) => {
  const {
    contextMenuPos,
    contextMenuTargetId,
    handleCanvasClick,
    handleCanvasDoubleClick,
    handleCanvasMouseDown,
    handleContextMenu,
    handleCloseContextMenu,
  } = useCanvasSelection()

  const canvasZoom = useEditorStore((state) => state.canvasZoom)
  const setCanvasZoom = useEditorStore((state) => state.setCanvasZoom)
  const [noteModalOpened, setNoteModalOpened] = useState(false)
  const [noteTargetId, setNoteTargetId] = useState<string | null>(null)

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
  })

  const handleAddNote = useCallback((nodeId: string | null) => {
    setNoteTargetId(nodeId)

    setNoteModalOpened(true)
  }, [])

  const handleCloseNoteModal = useCallback(() => {
    setNoteModalOpened(false)

    setNoteTargetId(null)
  }, [])

  const handleContextMenuCanvasContextMenu = handleContextMenu
  const handleSetNodeRefSurfaceRef = setNodeRef
  const handleSetCanvasZoomZoomChange = setCanvasZoom
  const handleCloseContextMenuClose = handleCloseContextMenu
  const handleCloseNoteModalClose = handleCloseNoteModal

  return (
    <Box className={styles.canvas}>
      <ResponsiveToolbar />
      <PreviewScenarios />
      <FlowToolbar onManageBehaviors={onManageBehaviors} />
      {/* Canvas artwork and editor guides share one clipped coordinate space.
          Toolbars and portalled menus/dialogs live outside this boundary. */}
      <ReferenceWorkspace>
        <Box
          className={styles.canvas__viewport}
          id='canvas-wrapper'
          onContextMenu={handleContextMenu}
        >
          <CanvasWorkspace
            isOver={isOver}
            onCanvasClick={handleCanvasClick}
            onCanvasContextMenu={handleContextMenuCanvasContextMenu}
            onCanvasDoubleClick={handleCanvasDoubleClick}
            onCanvasMouseDown={handleCanvasMouseDown}
            onSurfaceRef={handleSetNodeRefSurfaceRef}
          />
          <CanvasZoomControls zoom={canvasZoom} onZoomChange={handleSetCanvasZoomZoomChange} />
          <OverlayLayer />
          <TableEditingLayer />
          <CollectionEditingLayer />
        </Box>
      </ReferenceWorkspace>
      <ActionEditorHost />
      <CanvasContextMenu
        position={contextMenuPos}
        targetNodeId={contextMenuTargetId}
        onAddNote={handleAddNote}
        onClose={handleCloseContextMenuClose}
      />
      <NoteEditorModal
        isOpen={noteModalOpened}
        targetNodeId={noteTargetId}
        onClose={handleCloseNoteModalClose}
      />
    </Box>
  )
}
