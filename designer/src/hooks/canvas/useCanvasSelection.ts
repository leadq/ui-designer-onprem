import { useCallback, useRef, useState } from 'react'
import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'
import type { ContextMenuPosition } from '@root/types/contextMenu'
import { getTopCanvasNodeId } from '@root/utils/selection/getTopCanvasNodeId'
import { handleCanvasDoubleClick } from '@root/utils/selection/handleCanvasDoubleClick'
import { findNodeToSelect } from '@root/utils/selection/hitSelection'
import { isCanvasControl } from '@root/utils/selection/isCanvasControl'

export const useCanvasSelection = () => {
  const isContextGesture = useRef(false)
  const previewMode = useEditorStore((state) => state.previewMode)
  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null)
  const [contextMenuTargetId, setContextMenuTargetId] = useState<string | null>(null)

  const handleCanvasClick = (eventValue: React.MouseEvent) => {
    if (previewMode || isCanvasControl(eventValue.target)) {
      return
    }

    useReferenceStore.getState().clearSelection()

    eventValue.preventDefault()

    eventValue.stopPropagation()

    // WebKit forwards a label's right-click to its input as a synthetic left-click.
    // A genuine primary mousedown resets this guard; the forwarded event must not close the menu.
    if (isContextGesture.current) {
      return
    }

    if (contextMenuPos) {
      setContextMenuPos(null)

      return
    }

    const {
      focusedContainerId,
      nodes: freshNodes,
      setSelectedNodeIds,
      toggleNodeSelection: freshToggleNodeSelection,
      setFocusedContainer,
      clearSelection: freshClearSelection,
    } = useEditorStore.getState()

    if (eventValue.ctrlKey || eventValue.metaKey) {
      const deepestNodeId = getTopCanvasNodeId(eventValue.clientX, eventValue.clientY)

      if (deepestNodeId) {
        freshToggleNodeSelection(deepestNodeId)
      }

      return
    }

    let nodeToSelect = findNodeToSelect(
      eventValue.clientX,
      eventValue.clientY,
      focusedContainerId,
      freshNodes,
    )

    if (nodeToSelect) {
      setSelectedNodeIds([nodeToSelect])
    } else {
      if (focusedContainerId) {
        setFocusedContainer(null)

        nodeToSelect = findNodeToSelect(eventValue.clientX, eventValue.clientY, null, freshNodes)

        if (nodeToSelect) {
          setSelectedNodeIds([nodeToSelect])
        } else {
          freshClearSelection()
        }
      } else {
        freshClearSelection()
      }
    }
  }

  const handleCanvasMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) {
      isContextGesture.current = false
    }

    if (previewMode || isCanvasControl(event.target)) {
      return
    }

    event.preventDefault()

    event.stopPropagation()
  }

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      if (previewMode || event.ctrlKey || isCanvasControl(event.target)) {
        return
      }

      isContextGesture.current = true

      event.preventDefault()

      event.stopPropagation()

      const bestMatchId = getTopCanvasNodeId(event.clientX, event.clientY)
      const { setSelectedNodeIds, clearSelection: freshClearSelection } = useEditorStore.getState()

      if (bestMatchId) {
        setSelectedNodeIds([bestMatchId])
      } else {
        freshClearSelection()
      }

      setContextMenuTargetId(bestMatchId)

      setContextMenuPos({ x: event.clientX, y: event.clientY })
    },
    [previewMode],
  )

  const handleCloseContextMenu = useCallback(() => {
    isContextGesture.current = false

    setContextMenuPos(null)

    setContextMenuTargetId(null)
  }, [])

  return {
    contextMenuPos,
    contextMenuTargetId,
    handleCanvasClick,
    handleCanvasDoubleClick,
    handleCanvasMouseDown,
    handleContextMenu,
    handleCloseContextMenu,
  }
}
