import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useEditorStore } from '@root/stores/editor'

import type { ActiveItem } from '../types'
import { applyEditorDrop } from '../utils/applyEditorDrop'
import { getCenteredDragOverlay } from '../utils/getCenteredDragOverlay'

import { useDragDwell } from './useDragDwell'

export type { ActiveItem, DragActiveData } from '../types'

export const useEditorDrag = () => {
  const setDropTarget = useEditorStore((state) => state.setDropTarget)
  const addNode = useEditorStore((state) => state.addNode)
  const insertSavedDesign = useEditorStore((state) => state.insertSavedDesign)
  const moveNode = useEditorStore((state) => state.moveNode)
  const previewMode = useEditorStore((state) => state.previewMode)
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null)
  const rafRef = useRef<number | null>(null)

  const dragSessionRef = useRef<{
    id: DragStartEvent['active']['id']
    activatorEvent: Event
  } | null>(null)

  const lastPointerPos = useRef({ x: 0, y: 0 })
  // Palette dragging detection refs
  const isPaletteDragRef = useRef(false)
  const paletteDragDimsRef = useRef<{ width: number; height: number } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  const { activeDwellIdRef, resetDwellState, getDwellTarget } = useDragDwell(dragSessionRef)

  const clearDrag = useCallback(() => {
    // Invalidate first: dnd-kit can deliver a passive move after end/cancel.
    dragSessionRef.current = null

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = null

    resetDwellState()

    setDropTarget(null)

    setActiveItem(null)

    isPaletteDragRef.current = false

    paletteDragDimsRef.current = null
  }, [resetDwellState, setDropTarget])

  useEffect(() => {
    if (previewMode) {
      clearDrag()
    }
  }, [clearDrag, previewMode])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      lastPointerPos.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)

      clearDrag()
    }
  }, [clearDrag])

  const handleDragStart = (event: DragStartEvent) => {
    clearDrag()

    if (previewMode || !event.active.data.current) {
      return
    }

    dragSessionRef.current = { id: event.active.id, activatorEvent: event.activatorEvent }

    const activeData = event.active.data.current as ActiveItem

    setActiveItem(activeData)

    const activeId = event.active.id.toString()
    const isPalette = 'isPaletteItem' in activeData || activeId.startsWith('palette-')

    isPaletteDragRef.current = isPalette

    if (isPalette && event.active.rect.current.initial) {
      paletteDragDimsRef.current = {
        width: event.active.rect.current.initial.width,
        height: event.active.rect.current.initial.height,
      }
    } else {
      paletteDragDimsRef.current = null
    }
  }

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const session = dragSessionRef.current

      if (
        previewMode ||
        !session ||
        session.id !== event.active.id ||
        session.activatorEvent !== event.activatorEvent
      ) {
        return
      }

      if (rafRef.current !== null) {
        return
      }

      rafRef.current = requestAnimationFrame(() => {
        // A queued move must never repaint a completed or superseded drag.
        if (dragSessionRef.current !== session) {
          return
        }

        rafRef.current = null

        const ae = event.activatorEvent as PointerEvent | null
        const positionX = lastPointerPos.current.x || ae?.clientX || 0
        const positionY = lastPointerPos.current.y || ae?.clientY || 0
        const target = getDwellTarget(event, session, positionX, positionY)

        setDropTarget(target)
      })
    },
    [getDwellTarget, previewMode, setDropTarget],
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const finalDwellId = activeDwellIdRef.current || undefined

    const isCurrentDrag =
      dragSessionRef.current?.activatorEvent === event.activatorEvent &&
      dragSessionRef.current?.id === event.active.id

    clearDrag()

    if (previewMode || !isCurrentDrag) {
      return
    }

    applyEditorDrop(event, finalDwellId, lastPointerPos.current, {
      addNode,
      insertSavedDesign,
      moveNode,
    })
  }

  const centerOverlayOnCursor = useCallback<Modifier>(
    (args) => getCenteredDragOverlay(args, isPaletteDragRef.current),
    [],
  )

  const handleDragCancel = clearDrag

  return {
    activeItem,
    sensors,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
    centerOverlayOnCursor,
    isPalette: isPaletteDragRef.current,
    paletteWidth: paletteDragDimsRef.current?.width,
  }
}
