import { useLayoutEffect, useMemo, useRef } from 'react'
import { useEditorStore } from '@root/stores/editor'
import { getNodeElement } from '@root/utils/canvas/hitTesting'
import { getComponentStateSummary } from '@root/utils/conditions/componentState'
import { getAllNodes } from '@root/utils/flows/flowModel'

const SELECTION_TOOLBAR_OFFSET_PX = 30
const MARKER_HEADING_OFFSET_PX = 32
const MARKER_REFRESH_INTERVAL_MS = 100

export const useActionMarkerGeometry = () => {
  const nodes = useEditorStore((state) => state.nodes)
  const previewMode = useEditorStore((state) => state.previewMode)
  const selectedIds = useEditorStore((state) => state.selectedNodeIds)
  const zoom = useEditorStore((state) => state.canvasZoom)
  const layerRef = useRef<HTMLDivElement>(null)

  const sources = useMemo(() => {
    const all = getAllNodes(nodes)

    return all
      .map((node) => ({
        node,
        hasAction: Boolean(node.interactions?.length),
        hasState:
          !node.flow &&
          !node.overlay &&
          node.type !== 'designerFrame' &&
          getComponentStateSummary(nodes, node).hasSettings,
        hasNote:
          node.type !== 'designerFrame' && Boolean(node.notes?.trim() || node.annotations?.length),
      }))
      .filter((source) => source.hasAction || source.hasNote || source.hasState)
  }, [nodes])

  useLayoutEffect(() => {
    if (previewMode) {
      return
    }

    const wrapper = document.getElementById('canvas-content')

    if (!wrapper) {
      return
    }

    layerRef.current?.style.setProperty('--marker-scale', String(zoom))

    const update = () => {
      const origin = wrapper.getBoundingClientRect()

      sources.forEach(({ node }) => {
        const frameHeading = document.querySelector<HTMLElement>(
          `[data-frame-name="${CSS.escape(node.id)}"]`,
        )

        const target = frameHeading ?? getNodeElement(node.id)

        const marker = layerRef.current?.querySelector<HTMLElement>(
          `[data-node-markers="${CSS.escape(node.id)}"]`,
        )

        if (!marker) {
          return
        }

        const rect = target?.getBoundingClientRect()

        marker.hidden = !rect?.width || !rect.height

        if (rect) {
          const selectionSpace =
            !frameHeading && selectedIds.length === 1 && selectedIds.includes(node.id)
              ? SELECTION_TOOLBAR_OFFSET_PX
              : 0

          const width = marker.offsetWidth * zoom

          marker.style.setProperty(
            '--marker-x',
            `${rect.right - width - selectionSpace - origin.left}px`,
          )

          marker.style.setProperty(
            '--marker-y',
            `${rect.top - (frameHeading ? 0 : MARKER_HEADING_OFFSET_PX * zoom) - origin.top}px`,
          )
        }
      })
    }

    let pending: number | null = null

    const scheduleUpdate = () => {
      if (pending === null) {
        pending = requestAnimationFrame(() => {
          pending = null

          update()
        })
      }
    }

    const observer = new ResizeObserver(scheduleUpdate)

    observer.observe(wrapper)

    const layer = document.getElementById('render-layer')
    const mutations = new MutationObserver(scheduleUpdate)

    if (layer) {
      observer.observe(layer)

      mutations.observe(layer, { attributes: true, childList: true, subtree: true })
    }

    sources.forEach(({ node }) => {
      const element = getNodeElement(node.id)

      if (element) {
        observer.observe(element)
      }
    })

    // Native scrolling clips and moves the badges with their components.
    update()

    const interval = setInterval(scheduleUpdate, MARKER_REFRESH_INTERVAL_MS)

    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (pending !== null) {
        cancelAnimationFrame(pending)
      }

      clearInterval(interval)

      observer.disconnect()

      mutations.disconnect()

      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [sources, previewMode, zoom, selectedIds])

  return { previewMode, sources, layerRef }
}
