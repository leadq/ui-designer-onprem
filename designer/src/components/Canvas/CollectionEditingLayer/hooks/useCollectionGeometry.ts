import { useEffect, useState } from 'react'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { getNodeElement } from '@root/utils/canvas/hitTesting'
import { getCollectionContext } from '@root/utils/collectionAuthoring/getCollectionContext'

const REFRESH_INTERVAL = 100

interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

interface CollectionGeometry {
  id: string
  root: Bounds
  triggers: { id: string; bounds: Bounds }[]
}

export const useCollectionGeometry = () => {
  const nodes = useEditorStore((state) => state.nodes)
  const selected = useEditorStore((state) => state.selectedNodeIds[0])
  const isPreview = useEditorStore((state) => state.previewMode)
  const zoom = useEditorStore((state) => state.canvasZoom)

  const collection = selected
    ? getCollectionContext(nodes, selected, registry)?.collection
    : undefined

  const [geometry, setGeometry] = useState<CollectionGeometry | null>(null)

  useEffect(() => {
    const wrapper = document.getElementById('canvas-wrapper')

    if (!collection || isPreview || !wrapper) {
      setGeometry(null)

      return
    }

    const update = () => {
      const root = getNodeElement(collection.id)

      if (!root) {
        setGeometry(null)

        return
      }

      const origin = wrapper.getBoundingClientRect()

      const getBounds = (element: Element): Bounds => {
        const rect = element.getBoundingClientRect()

        return {
          x: rect.x - origin.x,
          y: rect.y - origin.y,
          width: rect.width,
          height: rect.height,
        }
      }

      const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-collection-trigger]'))
        .filter((element) => element.closest('[data-collection-root]') === root)
        .map((element) => ({
          id: element.dataset.collectionTrigger!,
          bounds: getBounds(element.closest('[role="tab"]') ?? element),
        }))

      const next = { id: collection.id, root: getBounds(root), triggers }

      setGeometry((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      )
    }

    update()

    const timer = window.setInterval(update, REFRESH_INTERVAL)

    return () => window.clearInterval(timer)
  }, [collection, isPreview])

  return { collection, geometry: geometry?.id === collection?.id ? geometry : null, zoom }
}
