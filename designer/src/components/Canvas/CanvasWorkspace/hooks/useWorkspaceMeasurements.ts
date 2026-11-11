import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { scrollToFrame } from '@root/utils/canvas/navigation'
import { getFrameIds } from '@root/utils/frames/frameWorkspace'

export const useWorkspaceMeasurements = (
  layerRef: RefObject<HTMLDivElement | null>,
  nodes: DesignNode[],
  width: number,
  isPreview: boolean,
  workspaceRevision: number,
) => {
  const previousFrames = useRef(new Set<string>())
  const previousRevision = useRef(workspaceRevision)
  const [extent, setExtent] = useState({ width, height: 600 })

  useLayoutEffect(() => {
    const layer = layerRef.current

    if (!layer) {
      return
    }

    const update = () => {
      const next = {
        width: Math.max(layer.offsetWidth, layer.scrollWidth),
        height: Math.max(layer.offsetHeight, layer.scrollHeight),
      }

      setExtent((previous) =>
        previous.width === next.width && previous.height === next.height ? previous : next,
      )
    }

    update()

    let pendingFrame: number | null = null

    const scheduleUpdate = () => {
      if (pendingFrame !== null) {
        return
      }

      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = null

        update()
      })
    }

    const observer = new ResizeObserver(scheduleUpdate)

    observer.observe(layer)

    // Child layout can change scroll extents without resizing the layer itself.
    const mutations = new MutationObserver(scheduleUpdate)

    mutations.observe(layer, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })

    return () => {
      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame)
      }

      observer.disconnect()

      mutations.disconnect()
    }
  }, [layerRef])

  useEffect(() => {
    const ids = getFrameIds(nodes)
    const active = useEditorStore.getState().editingFlowScreenId

    const isNew =
      previousRevision.current === workspaceRevision &&
      previousFrames.current.size > 0 &&
      active &&
      ids.has(active) &&
      !previousFrames.current.has(active)

    previousRevision.current = workspaceRevision

    previousFrames.current = ids

    if (isNew && !isPreview) {
      const frame = requestAnimationFrame(() => scrollToFrame(active))

      return () => cancelAnimationFrame(frame)
    }
  }, [nodes, isPreview, workspaceRevision])

  return extent
}
