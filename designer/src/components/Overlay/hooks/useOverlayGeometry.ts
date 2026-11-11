import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useEditorStore } from '@root/stores/editor'
import { getNodeElement } from '@root/utils/canvas/hitTesting'
import { areRectMapsEqual, areRectsEqual } from '@root/utils/overlay/rectEquality'

const OVERLAY_REFRESH_INTERVAL_MS = 100

export const useOverlayGeometry = () => {
  const selectedNodeIds = useEditorStore((state) => state.selectedNodeIds)
  const dropTarget = useEditorStore((state) => state.dropTarget)
  const removeSelectedNodes = useEditorStore((state) => state.removeSelectedNodes)
  const nodes = useEditorStore((state) => state.nodes)
  const previewMode = useEditorStore((state) => state.previewMode)
  const showParentBorder = useEditorStore((state) => state.outlineMode === 'parent')
  const focusedContainerId = useEditorStore((state) => state.focusedContainerId)
  const [selectionRects, setSelectionRects] = useState<Record<string, DOMRect>>({})
  const [dropIndicatorRect, setDropIndicatorRect] = useState<DOMRect | null>(null)
  const [focusedRect, setFocusedRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (previewMode) {
      setSelectionRects({})

      setDropIndicatorRect(null)

      setFocusedRect(null)

      return
    }

    const wrapper = document.getElementById('canvas-wrapper')

    if (!wrapper) {
      return
    }

    const getRelativeRect = (element: Element, wrapperRect: DOMRect): DOMRect => {
      const bounds = element.getBoundingClientRect()

      return new DOMRect(
        bounds.left - wrapperRect.left,
        bounds.top - wrapperRect.top,
        bounds.width,
        bounds.height,
      )
    }

    const updateRects = () => {
      const wrapperRect = wrapper.getBoundingClientRect()
      const newRects: Record<string, DOMRect> = {}

      selectedNodeIds.forEach((id) => {
        const element = getNodeElement(id)

        if (element) {
          const rect = getRelativeRect(element, wrapperRect)

          if (rect) {
            newRects[id] = rect
          }
        }
      })

      setSelectionRects((previous) => (areRectMapsEqual(previous, newRects) ? previous : newRects))

      if (dropTarget && dropTarget.targetId !== 'canvas-root') {
        const element = getNodeElement(dropTarget.targetId)
        const rect = element ? getRelativeRect(element, wrapperRect) : null

        setDropIndicatorRect((previous) => (areRectsEqual(previous, rect) ? previous : rect))
      } else {
        setDropIndicatorRect(null)
      }

      // Update focused container rect
      if (showParentBorder && focusedContainerId) {
        const element = getNodeElement(focusedContainerId)
        const rect = element ? getRelativeRect(element, wrapperRect) : null

        setFocusedRect((previous) => (areRectsEqual(previous, rect) ? previous : rect))
      } else {
        setFocusedRect(null)
      }
    }

    // Coalesce scroll, resize and fallback signals into one measurement per paint.
    let scheduledFrame: number | null = null

    const scheduleUpdate = () => {
      if (scheduledFrame !== null) {
        return
      }

      scheduledFrame = requestAnimationFrame(() => {
        scheduledFrame = null

        // Geometry is already batched once per paint. Commit before that paint so
        // concurrent React scheduling cannot leave outlines one scroll frame behind.
        flushSync(updateRects)
      })
    }

    updateRects()

    const resizeObserver = new ResizeObserver(scheduleUpdate)

    new Set([
      ...selectedNodeIds,
      ...(showParentBorder && focusedContainerId ? [focusedContainerId] : []),
      ...(dropTarget ? [dropTarget.targetId] : []),
    ]).forEach((id) => {
      const element = getNodeElement(id)

      if (element) {
        resizeObserver.observe(element)
      }
    })

    // Keep the existing fallback for position-only layout changes and CSS transforms.
    const interval = setInterval(scheduleUpdate, OVERLAY_REFRESH_INTERVAL_MS)

    window.addEventListener('resize', scheduleUpdate)

    const container = document.getElementById('canvas-scroll-container')

    container?.addEventListener('scroll', scheduleUpdate, { passive: true })

    // Zoom is a CSS transform: ResizeObserver does not report transformed bounds.
    const mutations = new MutationObserver(scheduleUpdate)

    if (container) {
      mutations.observe(container, { attributes: true, attributeFilter: ['style'] })
    }

    return () => {
      resizeObserver.disconnect()

      mutations.disconnect()

      clearInterval(interval)

      if (scheduledFrame !== null) {
        cancelAnimationFrame(scheduledFrame)
      }

      window.removeEventListener('resize', scheduleUpdate)

      container?.removeEventListener('scroll', scheduleUpdate)
    }
  }, [selectedNodeIds, dropTarget, previewMode, focusedContainerId, showParentBorder])

  return {
    selectedNodeIds,
    dropTarget,
    removeSelectedNodes,
    nodes,
    previewMode,
    showParentBorder,
    focusedContainerId,
    selectionRects,
    dropIndicatorRect,
    focusedRect,
  }
}
