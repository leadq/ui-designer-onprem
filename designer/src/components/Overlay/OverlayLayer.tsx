import { getNodeDropAxis } from '@root/utils/canvas/hitTesting'
import { findNode } from '@root/utils/nodes'

import { ButtonBase } from '../common/ButtonBase'

import { useOverlayGeometry } from './hooks/useOverlayGeometry'
import { useOverlayRemoval } from './hooks/useOverlayRemoval'
import { ResizeHandles } from './ResizeHandles/ResizeHandles'
import { FocusedContainerOutline } from './FocusedContainerOutline'

const DROP_INDICATOR_OFFSET = 2
const DROP_MARKER_HALF_WIDTH = 2
const DROP_MARKER_WIDTH = 4

export const OverlayLayer = () => {
  const handleRemove = useOverlayRemoval()

  const {
    selectedNodeIds,
    dropTarget,
    nodes,
    previewMode,
    showParentBorder,
    focusedContainerId,
    selectionRects,
    dropIndicatorRect,
    focusedRect,
  } = useOverlayGeometry()

  if (previewMode) {
    return null
  }

  const hasContent =
    Object.keys(selectionRects).length > 0 ||
    (dropIndicatorRect && dropTarget) ||
    focusedRect !== null

  if (!hasContent) {
    return null
  }

  const isHorizontalDrop = dropTarget && getNodeDropAxis(dropTarget.targetId, nodes) === 'x'

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {/* Selection Borders */}
      {Object.entries(selectionRects).map(([nodeId, rect]) => (
        <div
          key={nodeId}
          data-selection-node-id={nodeId}
          style={{
            position: 'absolute',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            border: '2px solid var(--primary)',
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        >
          {selectedNodeIds.length === 1 && findNode(nodes, nodeId)?.type !== 'designerFrame' && (
            <>
              <ResizeHandles nodeId={nodeId} rect={rect} />
              <ButtonBase
                style={{
                  position: 'absolute',
                  top: -32,
                  right: -2,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'var(--danger)',
                  color: 'var(--text-inverse)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  border: 'none',
                  pointerEvents: 'auto',
                  boxShadow: 'var(--shadow-md)',
                  cursor: 'pointer',
                }}
                onClick={(event) => {
                  event.stopPropagation()

                  handleRemove(nodeId)
                }}
              >
                ✕
              </ButtonBase>
            </>
          )}
        </div>
      ))}

      {/* Drop Indicator */}
      {dropIndicatorRect && dropTarget ? (
        <div
          data-drop-position={dropTarget.position}
          data-drop-target-id={dropTarget.targetId}
          style={{
            position: 'absolute',
            top: isHorizontalDrop
              ? dropIndicatorRect.top
              : dropTarget.position === 'after'
                ? dropIndicatorRect.top + dropIndicatorRect.height
                : dropTarget.position === 'before'
                  ? dropIndicatorRect.top - DROP_INDICATOR_OFFSET
                  : dropIndicatorRect.top,
            left:
              isHorizontalDrop && dropTarget.position !== 'inside'
                ? dropIndicatorRect.left +
                  (dropTarget.position === 'after'
                    ? dropIndicatorRect.width
                    : -DROP_MARKER_HALF_WIDTH)
                : dropIndicatorRect.left,
            width:
              isHorizontalDrop && dropTarget.position !== 'inside'
                ? DROP_MARKER_WIDTH
                : dropIndicatorRect.width,
            height: isHorizontalDrop
              ? dropIndicatorRect.height
              : dropTarget.position === 'inside'
                ? dropIndicatorRect.height
                : DROP_MARKER_WIDTH,
            backgroundColor:
              dropTarget.position === 'inside'
                ? 'rgba(var(--primary-rgb), 0.15)'
                : 'var(--primary)',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 1001,
            boxShadow:
              dropTarget.position === 'inside'
                ? 'inset 0 0 0 2px var(--primary)'
                : '0 0 8px rgba(var(--primary-rgb), 0.5)',
          }}
        />
      ) : null}

      {/* Focused Container Border */}
      {showParentBorder && focusedRect && focusedContainerId ? (
        <FocusedContainerOutline
          focusedContainerId={focusedContainerId}
          focusedRect={focusedRect}
        />
      ) : null}
    </div>
  )
}
