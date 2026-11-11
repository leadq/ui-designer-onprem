import { useCallback, useEffect, useRef, useState } from 'react'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { getNodeLayoutStyle } from '@root/utils/canvas/hitTesting'
import { getFillSizeStyle } from '@root/utils/layout/getFillSizeStyle'
import { getFixedSizeStyle } from '@root/utils/layout/getFixedSizeStyle'
import { getStyleAtBreakpoint } from '@root/utils/layout/getStyleAtBreakpoint'
import { findNode, findParent } from '@root/utils/nodes'

const MIN_RESIZE_DIMENSION = 24

export type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

interface ResizeSession {
  direction: ResizeDirection
  startX: number
  startY: number
  startWidth: number
  startHeight: number
  hasChanged: boolean
}

export const useResizeInteraction = (nodeId: string, rect: DOMRect) => {
  const [measurement, setMeasurement] = useState<string | null>(null)
  const sessionRef = useRef<ResizeSession | null>(null)

  const handlePointerDown = useCallback(
    (direction: ResizeDirection, event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault()

      event.stopPropagation()

      const zoom = useEditorStore.getState().canvasZoom

      sessionRef.current = {
        direction,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: rect.width / zoom,
        startHeight: rect.height / zoom,
        hasChanged: false,
      }
    },
    [rect],
  )

  const handleFill = useCallback(
    (direction: ResizeDirection) => {
      const state = useEditorStore.getState()
      const node = findNode(state.nodes, nodeId)

      if (!node) {
        return
      }

      const parent = findParent(state.nodes, nodeId)

      const parentStyle = parent
        ? (getNodeLayoutStyle(parent.id) ??
          getStyleAtBreakpoint(parent, state.activeBreakpoint, registry[parent.type]?.defaultStyle))
        : undefined

      const axis = direction === 'e' || direction === 'w' ? 'horizontal' : 'vertical'

      state.updateResponsiveStyle(
        nodeId,
        state.activeBreakpoint,
        getFillSizeStyle(axis, parentStyle),
      )
    },
    [nodeId],
  )

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const session = sessionRef.current

      if (!session) {
        return
      }

      const state = useEditorStore.getState()
      const parent = findParent(state.nodes, nodeId)

      const parentStyle = parent
        ? (getNodeLayoutStyle(parent.id) ??
          getStyleAtBreakpoint(parent, state.activeBreakpoint, registry[parent.type]?.defaultStyle))
        : undefined

      const deltaX = (event.clientX - session.startX) / state.canvasZoom
      const deltaY = (event.clientY - session.startY) / state.canvasZoom
      const horizontalSign = session.direction.includes('w') ? -1 : 1
      const verticalSign = session.direction.includes('n') ? -1 : 1
      const changes: React.CSSProperties = {}
      let width = session.startWidth
      let height = session.startHeight

      if (/[ew]/.test(session.direction)) {
        width = Math.max(MIN_RESIZE_DIMENSION, session.startWidth + deltaX * horizontalSign)

        Object.assign(changes, getFixedSizeStyle('horizontal', width, parentStyle))
      }

      if (/[ns]/.test(session.direction)) {
        height = Math.max(MIN_RESIZE_DIMENSION, session.startHeight + deltaY * verticalSign)

        Object.assign(changes, getFixedSizeStyle('vertical', height, parentStyle))
      }

      session.hasChanged = true

      state.updateResponsiveStyleTransient(nodeId, state.activeBreakpoint, changes)

      setMeasurement(`${Math.round(width)} × ${Math.round(height)}`)
    }

    const handlePointerUp = () => {
      const session = sessionRef.current

      if (!session) {
        return
      }

      if (session.hasChanged) {
        useEditorStore.getState().commitTransientStyleUpdate()
      }

      sessionRef.current = null

      setMeasurement(null)
    }

    window.addEventListener('pointermove', handlePointerMove)

    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)

      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [nodeId])

  return { measurement, handlePointerDown, handleFill }
}
