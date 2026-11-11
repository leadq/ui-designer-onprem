import { type CSSProperties, type MouseEventHandler, useRef } from 'react'
import { useDndContext } from '@dnd-kit/core'
import { getAdapter } from '@root/adapters'
import { Box } from '@root/components/common'
import { ActionMarkers } from '@root/components/Flows/ActionMarkers'
import { CanvasConnections } from '@root/components/Flows/CanvasConnections'
import { CanvasReference } from '@root/components/References/CanvasReference'
import { FRAME_GAP } from '@root/constants/canvas/workspace'
import { useCanvasPan } from '@root/hooks/canvas/useCanvasPan'
import { useInitialCanvasFit } from '@root/hooks/canvas/useInitialCanvasFit'
import { useWorkspaceViewport } from '@root/hooks/canvas/useWorkspaceViewport'
import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'
import { getWorkspaceSurfaceWidth } from '@root/utils/canvas/getWorkspaceSurfaceWidth'
import { getAdapterBackgroundColor } from '@root/utils/colorTokens/getAdapterBackgroundColor'
import { getFrameIds } from '@root/utils/frames/frameWorkspace'
import { getReferencePlacement } from '@root/utils/references/placement'

import { CanvasNavigation } from '../CanvasNavigation'
import { CanvasNodes } from '../CanvasNodes'

import { useCanvasWheelZoom } from './hooks/useCanvasWheelZoom'
import { useWorkspaceMeasurements } from './hooks/useWorkspaceMeasurements'

import styles from './styles.module.scss'

const OPPOSITE_SIDES = 2
const DEFAULT_CANVAS_WIDTH = 1024

export interface CanvasWorkspaceProps {
  isOver: boolean
  onSurfaceRef: (element: HTMLElement | null) => void
  onCanvasClick: MouseEventHandler<HTMLDivElement>
  onCanvasDoubleClick: MouseEventHandler<HTMLDivElement>
  onCanvasMouseDown: MouseEventHandler<HTMLDivElement>
  onCanvasContextMenu: MouseEventHandler<HTMLDivElement>
}

export const CanvasWorkspace = ({
  isOver,
  onSurfaceRef,
  onCanvasClick,
  onCanvasDoubleClick,
  onCanvasMouseDown,
  onCanvasContextMenu,
}: CanvasWorkspaceProps) => {
  const images = useReferenceStore((state) => state.images)
  const workspaceLane = useReferenceStore((state) => state.workspaceLane)
  const { active } = useDndContext()
  const nodes = useEditorStore((state) => state.nodes)
  const adapterId = useEditorStore((state) => state.adapterId)
  const previewMode = useEditorStore((state) => state.previewMode)
  const workspaceRevision = useEditorStore((state) => state.workspaceRevision)
  const zoom = useEditorStore((state) => state.canvasZoom)
  const width = useEditorStore((state) => state.canvasWidth) ?? DEFAULT_CANVAS_WIDTH
  const viewportRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement | null>(null)
  const workspace = useWorkspaceViewport(viewportRef, previewMode)
  const pan = useCanvasPan(viewportRef, !previewMode)

  useInitialCanvasFit(viewportRef, layerRef, workspaceRevision, previewMode)

  const adapter = getAdapter(adapterId)
  const AdapterProvider = adapter.Provider
  const extent = useWorkspaceMeasurements(layerRef, nodes, width, previewMode, workspaceRevision)

  useCanvasWheelZoom(viewportRef, layerRef, previewMode)

  const frameIds = getFrameIds(nodes)
  const frameCount = nodes.filter((node) => frameIds.has(node.id) && !node.overlay).length
  const surfaceWidth = previewMode ? width : getWorkspaceSurfaceWidth(frameCount)
  const referenceLane = previewMode ? 0 : workspaceLane

  const referenceBounds = images.map((image) => {
    const place = getReferencePlacement(image)

    return {
      right: place.x + place.width,
      bottom: place.y + (place.width * image.height) / image.width,
    }
  })

  const variables = {
    '--designer-frame-background': getAdapterBackgroundColor(adapter),
    '--frame-gap': `${FRAME_GAP}px`,
    '--frame-width': `${width}px`,
    '--surface-width': `${surfaceWidth}px`,
    '--canvas-scale': zoom,
    '--reference-origin-x': `${workspace.originX}px`,
    '--surface-x': `${workspace.originX + referenceLane * zoom}px`,
    '--surface-y': `${workspace.originY}px`,
    '--workspace-width': `${Math.max(workspace.width, Math.max(referenceLane + Math.max(extent.width, surfaceWidth), ...referenceBounds.map((item) => item.right)) * zoom) + workspace.originX * OPPOSITE_SIDES}px`,
    '--workspace-height': `${Math.max(workspace.height, Math.max(extent.height, ...referenceBounds.map((item) => item.bottom)) * zoom) + workspace.originY * OPPOSITE_SIDES}px`,
  } as CSSProperties

  const handleHandToolChange = pan.setIsHandTool

  return (
    <>
      <Box
        ref={viewportRef}
        data-editor-viewport
        className={styles.canvasWorkspace}
        data-dragging={!previewMode && Boolean(active)}
        data-grab={pan.isGrabCursor}
        data-panning={pan.isPanning}
        data-preview={previewMode}
        id='canvas-scroll-container'
        style={variables}
        {...pan.handlers}
        onContextMenu={onCanvasContextMenu}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onCanvasClick(event)
          }
        }}
      >
        <Box
          className={styles.canvasWorkspace__extent}
          id='canvas-content'
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onCanvasClick(event)
            }
          }}
        >
          {!previewMode && (
            <Box className={styles.canvasWorkspace__references}>
              {images.map((image) => (
                <CanvasReference key={image.id} image={image} />
              ))}
            </Box>
          )}
          <Box
            ref={(element) => {
              layerRef.current = element

              onSurfaceRef(element)
            }}
            className={styles.canvasWorkspace__surface}
            data-over={isOver}
            id='render-layer'
            onClickCapture={onCanvasClick}
            onDoubleClickCapture={onCanvasDoubleClick}
            onMouseDownCapture={onCanvasMouseDown}
          >
            <AdapterProvider key={adapterId}>
              <CanvasNodes isPreviewMode={previewMode} nodes={nodes} />
            </AdapterProvider>
          </Box>
          <CanvasConnections />
          <ActionMarkers />
        </Box>
      </Box>
      {!previewMode && (
        <CanvasNavigation isHandTool={pan.isHandTool} onHandToolChange={handleHandToolChange} />
      )}
    </>
  )
}
