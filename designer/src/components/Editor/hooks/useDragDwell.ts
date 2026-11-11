import { type MutableRefObject, useCallback, useRef } from 'react'
import type { DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { getDropTarget } from '@root/utils/canvas/hitTesting'
import { findNode, findParent } from '@root/utils/nodes'

import { activateCanvasViewAtPoint } from '../utils/activateCanvasViewAtPoint'

const CONTAINER_DWELL_MS = 750

interface DragSession {
  id: DragStartEvent['active']['id']
  activatorEvent: Event
}

export const useDragDwell = (dragSessionRef: MutableRefObject<DragSession | null>) => {
  // Dwell timer refs
  const dwellContainerIdRef = useRef<string | null>(null)
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeDwellIdRef = useRef<string | null>(null)

  const clearDwellTimer = useCallback(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)

      dwellTimerRef.current = null
    }
  }, [])

  const resetDwellState = useCallback(() => {
    clearDwellTimer()

    dwellContainerIdRef.current = null

    activeDwellIdRef.current = null
  }, [clearDwellTimer])

  const getDwellTarget = useCallback(
    (event: DragMoveEvent, session: DragSession, positionX: number, positionY: number) => {
      activateCanvasViewAtPoint(positionX, positionY)

      const { nodes: freshNodes } = useEditorStore.getState()
      const activeId = String(event.active.data.current?.id ?? event.active.id)
      let target: { targetId: string; position: 'before' | 'after' | 'inside' } | null = null

      // 1) Handle active dwell check
      if (activeDwellIdRef.current) {
        target = getDropTarget(
          positionX,
          positionY,
          freshNodes,
          registry,
          activeId,
          activeDwellIdRef.current,
        )

        if (!target) {
          // If we moved out of dwell boundary, reset dwell and fallback to normal hit-testing
          resetDwellState()

          target = getDropTarget(positionX, positionY, freshNodes, registry, activeId)
        } else {
          // We hit a node inside our active dwell container. Check if it's a nested container.
          const hitNode = findNode(freshNodes, target.targetId)
          const isContainer = hitNode ? registry[hitNode.type]?.isContainer : false

          if (isContainer && target.position === 'inside') {
            if (dwellContainerIdRef.current !== target.targetId) {
              clearDwellTimer()

              dwellContainerIdRef.current = target.targetId

              const nextDwellId = target.targetId

              dwellTimerRef.current = setTimeout(() => {
                if (dragSessionRef.current === session) {
                  activeDwellIdRef.current = nextDwellId
                }
              }, CONTAINER_DWELL_MS)
            }
          } else {
            clearDwellTimer()

            dwellContainerIdRef.current = activeDwellIdRef.current
          }
        }
      }

      // 2) Handle normal check (or fallback when we just exited dwell)
      if (!activeDwellIdRef.current) {
        target = getDropTarget(positionX, positionY, freshNodes, registry, activeId)

        if (target) {
          const containerId =
            target.position === 'inside'
              ? target.targetId
              : (findParent(freshNodes, target.targetId)?.id ?? null)

          if (containerId && containerId !== 'canvas-root') {
            if (dwellContainerIdRef.current !== containerId) {
              clearDwellTimer()

              dwellContainerIdRef.current = containerId

              const nextContainerId = containerId

              dwellTimerRef.current = setTimeout(() => {
                if (dragSessionRef.current === session) {
                  activeDwellIdRef.current = nextContainerId
                }
              }, CONTAINER_DWELL_MS)
            }
          } else {
            resetDwellState()
          }
        } else {
          resetDwellState()
        }
      }

      return target
    },
    [clearDwellTimer, resetDwellState, dragSessionRef],
  )

  return { activeDwellIdRef, resetDwellState, getDwellTarget }
}
