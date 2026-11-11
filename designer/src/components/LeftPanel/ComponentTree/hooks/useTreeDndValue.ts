import { type DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { findNode, isDescendant } from '@root/utils/nodes'

import type { DropIndicator, TreeDndContextType } from '../contexts/TreeDndContext'

const BEFORE_DROP_RATIO = 0.3
const AFTER_DROP_RATIO = 0.7
const MIDPOINT_RATIO = 0.5

export const useTreeDndValue = (): TreeDndContextType => {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null)
  const draggingIdRef = useRef<string | null>(null)
  const dropIndicatorRef = useRef<DropIndicator | null>(null)
  const nodes = useEditorStore((state) => state.nodes)
  const moveNode = useEditorStore((state) => state.moveNode)
  const nodesRef = useRef<DesignNode[]>(nodes)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  const handleRowDragStart = useCallback((nodeId: string, event: DragEvent) => {
    setDraggingId(nodeId)

    draggingIdRef.current = nodeId

    event.dataTransfer.setData('application/tree-node-id', nodeId)

    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleClearDropIndicator = useCallback((event?: DragEvent) => {
    if (event?.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return
    }

    setDropIndicator(null)

    dropIndicatorRef.current = null
  }, [])

  const handleRowDragOver = useCallback(
    (nodeId: string, isContainer: boolean, event: DragEvent) => {
      const isTreeDrag = event.dataTransfer.types.includes('application/tree-node-id')

      if (!isTreeDrag) {
        return
      }

      event.preventDefault()

      event.stopPropagation()

      const srcId = draggingIdRef.current

      if (!srcId) {
        return
      }

      // Prevent dropping onto itself or its descendants
      if (srcId === nodeId) {
        event.dataTransfer.dropEffect = 'none'

        handleClearDropIndicator()

        return
      }

      const srcNode = findNode(nodesRef.current, srcId)

      if (srcNode && isDescendant(srcNode, nodeId)) {
        event.dataTransfer.dropEffect = 'none'

        handleClearDropIndicator()

        return
      }

      event.dataTransfer.dropEffect = 'move'

      // Calculate position based on cursor relative Y percentage within the row element
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const relativeY = (event.clientY - rect.top) / rect.height
      let position: 'before' | 'after' | 'inside'

      if (isContainer) {
        if (relativeY < BEFORE_DROP_RATIO) {
          position = 'before'
        } else if (relativeY > AFTER_DROP_RATIO) {
          position = 'after'
        } else {
          position = 'inside'
        }
      } else {
        if (relativeY < MIDPOINT_RATIO) {
          position = 'before'
        } else {
          position = 'after'
        }
      }

      const newIndicator: DropIndicator = { targetId: nodeId, position }

      setDropIndicator(newIndicator)

      dropIndicatorRef.current = newIndicator
    },
    [handleClearDropIndicator],
  )

  const handleRowDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()

      event.stopPropagation()

      const srcId = draggingIdRef.current
      const indicator = dropIndicatorRef.current

      if (srcId && indicator) {
        moveNode(srcId, indicator.targetId, indicator.position)
      }

      setDraggingId(null)

      draggingIdRef.current = null

      setDropIndicator(null)

      dropIndicatorRef.current = null
    },
    [moveNode],
  )

  const handleRowDragEnd = useCallback(() => {
    setDraggingId(null)

    draggingIdRef.current = null

    setDropIndicator(null)

    dropIndicatorRef.current = null
  }, [])

  return useMemo<TreeDndContextType>(
    () => ({
      draggingId,
      dropIndicator,
      handleRowDragStart,
      handleRowDragOver,
      handleRowDrop,
      handleClearDropIndicator,
      handleRowDragEnd,
    }),
    [
      draggingId,
      dropIndicator,
      handleRowDragStart,
      handleRowDragOver,
      handleRowDrop,
      handleClearDropIndicator,
      handleRowDragEnd,
    ],
  )
}
