import { useLayoutEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { useEditorStore } from '@root/stores/editor'
import { type ConnectionLinesModel } from '@root/types/connectionLines'
import { getNodeElement } from '@root/utils/canvas/hitTesting'
import { getCanvasConnectionEdges } from '@root/utils/connections/getCanvasConnectionEdges'
import { getViewConnectionPaths } from '@root/utils/connections/getViewConnectionPaths'

const CONNECTION_REFRESH_INTERVAL_MS = 100
const EMPTY_GEOMETRY: ConnectionLinesModel = { paths: [] }

export const useCanvasConnections = (): ConnectionLinesModel => {
  const nodes = useEditorStore((state) => state.nodes)
  const selectedIds = useEditorStore((state) => state.selectedNodeIds)
  const preview = useEditorStore((state) => state.previewMode)
  const edges = useMemo(() => getCanvasConnectionEdges(nodes), [nodes])
  const [geometry, setGeometry] = useState<ConnectionLinesModel>(EMPTY_GEOMETRY)

  useLayoutEffect(() => {
    if (preview) {
      setGeometry(EMPTY_GEOMETRY)

      return
    }

    const wrapper = document.getElementById('canvas-content')
    const viewport = document.getElementById('canvas-scroll-container')
    const layer = document.getElementById('render-layer')

    if (!wrapper || !viewport || !layer) {
      return
    }

    const update = () => {
      const allPaths = getViewConnectionPaths(nodes, selectedIds, wrapper, layer)

      setGeometry((previous) =>
        JSON.stringify(previous.paths) === JSON.stringify(allPaths)
          ? previous
          : { paths: allPaths },
      )
    }

    let pending: number | null = null

    const schedule = () => {
      if (pending === null) {
        pending = requestAnimationFrame(() => {
          pending = null

          flushSync(update)
        })
      }
    }

    const observer = new ResizeObserver(schedule)
    const observedElements = [wrapper, viewport, layer]

    observedElements.forEach((element) => {
      observer.observe(element)
    })

    edges.forEach((edge) => {
      const nodeIds = [edge.source.id, edge.sourceFrame.id, edge.targetFrame.id]

      nodeIds.forEach((id) => {
        const element = getNodeElement(id)

        if (element) {
          observer.observe(element)
        }
      })
    })

    // Observe the rendered source of geometry, including transforms and overlay visibility.
    const mutations = new MutationObserver(schedule)

    mutations.observe(viewport, { attributes: true, attributeFilter: ['style'] })

    mutations.observe(layer, { attributes: true, childList: true, subtree: true })

    const interval = setInterval(schedule, CONNECTION_REFRESH_INTERVAL_MS)

    // SVG shares the scroll content with the frames, so panning needs no measurements.
    update()

    return () => {
      if (pending !== null) {
        cancelAnimationFrame(pending)
      }

      observer.disconnect()

      mutations.disconnect()

      clearInterval(interval)
    }
  }, [edges, nodes, selectedIds, preview])

  return geometry
}
