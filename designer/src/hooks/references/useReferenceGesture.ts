import { type PointerEvent, useEffect, useRef } from 'react'
import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'
import type { ReferenceImage, ReferencePlacement } from '@root/types/references'
import { persistReferencePlacements } from '@root/utils/references/persistReferencePlacements'
import { getReferencePlacement, resizeReference } from '@root/utils/references/placement'

import { useReferenceKeyboard } from './useReferenceKeyboard'

const DRAG_THRESHOLD_PX = 3

interface Gesture {
  isClickCollapseEnabled: boolean
  id: number
  x: number
  y: number
  zoom: number
  handle: string
  starts: Map<string, ReferencePlacement>
}

export const useReferenceGesture = (image: ReferenceImage) => {
  const gesture = useRef<Gesture | null>(null)

  const cancel = () => {
    const current = gesture.current

    gesture.current = null

    current?.starts.forEach((placement, id) => {
      useReferenceStore.getState().place(id, placement)
    })
  }

  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && gesture.current) {
        event.preventDefault()

        cancel()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)

      cancel()
    }
  }, [])

  const handlePointerDown = (event: PointerEvent<HTMLElement>, handle = '') => {
    if (
      event.button !== 0 ||
      event.defaultPrevented ||
      event.currentTarget.closest('[data-grab="true"]')
    ) {
      return
    }

    event.preventDefault()

    event.stopPropagation()

    event.currentTarget.focus({ preventScroll: true })

    const state = useReferenceStore.getState()
    const additive = event.metaKey || event.ctrlKey || event.shiftKey

    if (additive || !state.selectedIds.includes(image.id)) {
      state.select(image.id, additive)
    }

    useEditorStore.getState().clearSelection()

    if (additive && state.selectedIds.includes(image.id)) {
      return
    }

    const ids = handle ? [image.id] : useReferenceStore.getState().selectedIds

    gesture.current = {
      isClickCollapseEnabled: !additive && !handle && state.selectedIds.length > 1,
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      zoom: useEditorStore.getState().canvasZoom,
      handle,
      starts: new Map(
        state.images
          .filter((item) => ids.includes(item.id))
          .map((item) => [item.id, getReferencePlacement(item)]),
      ),
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current

    if (!current || current.id !== event.pointerId) {
      return
    }

    const dx = (event.clientX - current.x) / current.zoom
    const dy = (event.clientY - current.y) / current.zoom

    if (Math.hypot(dx, dy) * current.zoom > DRAG_THRESHOLD_PX) {
      current.isClickCollapseEnabled = false
    }

    const state = useReferenceStore.getState()

    if (current.handle) {
      state.place(
        image.id,
        resizeReference(image, current.starts.get(image.id)!, current.handle, dx, dy),
      )

      return
    }

    const positionX = Math.max(dx, -Math.min(...[...current.starts.values()].map((item) => item.x)))
    const positionY = Math.max(dy, -Math.min(...[...current.starts.values()].map((item) => item.y)))

    current.starts.forEach((start, id) => {
      state.place(id, { ...start, x: start.x + positionX, y: start.y + positionY })
    })
  }

  const handlePointerUp = () => {
    const current = gesture.current

    gesture.current = null

    if (current?.isClickCollapseEnabled) {
      useReferenceStore.getState().select(image.id)
    }

    if (current) {
      void persistReferencePlacements([...current.starts.keys()])
    }
  }

  const handleKeyDown = useReferenceKeyboard(image.id, cancel)

  return {
    handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onKeyDown: handleKeyDown,
    onPointerCancel: cancel,
    onLostPointerCapture: cancel,
  }
}
