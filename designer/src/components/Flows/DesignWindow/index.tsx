import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DesignInteractionSurface } from '@root/components/Canvas/DesignInteractionSurface'
import { Box } from '@root/components/common'
import { useCanvasView } from '@root/contexts/CanvasViewContext/hooks/useCanvasView'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getNodeElement } from '@root/utils/canvas/hitTesting'
import { getOverlaySurface } from '@root/utils/flows/getOverlaySurface'
import { findNode } from '@root/utils/nodes'

import styles from './styles.module.scss'

const MIN_DESIGN_WINDOW_HEIGHT = 220

export interface DesignWindowProps {
  node: DesignNode
  children: ReactNode
}

/** A canvas-local modal surface; no focus trap or editor-blocking portal in design mode. */
export const DesignWindow = ({ node, children }: DesignWindowProps) => {
  const view = useCanvasView()
  const { translate } = useBuilderI18n()
  const Surface = getOverlaySurface(node, registry)
  const [host, setHost] = useState<HTMLElement | null>(null)

  useLayoutEffect(
    () =>
      setHost(
        view
          ? document.querySelector<HTMLElement>(`[data-view-id="${CSS.escape(view.id)}"]`)
          : document.getElementById('render-layer'),
      ),
    [view],
  )

  const ref = useRef<HTMLDivElement>(null)
  const nodes = useEditorStore((state) => state.nodes)
  const zoom = useEditorStore((state) => state.canvasZoom)
  const editingId = useEditorStore((state) => state.editingFlowScreenId)

  useLayoutEffect(() => {
    const ownerNode = node.overlay && findNode(nodes, node.overlay.ownerFrameId)
    const owner = ownerNode && getNodeElement(ownerNode.id, view?.id)
    const layer = host
    const surface = ref.current

    if (!owner || !layer || !surface) {
      return
    }

    const update = () => {
      const box = owner.getBoundingClientRect()
      const origin = layer.getBoundingClientRect()
      const isEditing = editingId === node.id

      surface.hidden = !box.width || (!isEditing && !node.overlay?.initiallyOpen)

      surface.style.setProperty('--window-x', `${(box.left - origin.left) / zoom}px`)

      surface.style.setProperty('--window-y', `${(box.top - origin.top) / zoom}px`)

      surface.style.setProperty('--window-width', `${box.width / zoom}px`)

      surface.style.setProperty(
        '--window-height',
        `${Math.max(box.height / zoom, MIN_DESIGN_WINDOW_HEIGHT)}px`,
      )
    }

    update()

    const observer = new ResizeObserver(update)

    observer.observe(owner)

    observer.observe(layer)

    return () => observer.disconnect()
  }, [nodes, node.id, node.overlay, zoom, editingId, host, view])

  if (!host || !Surface) {
    return null
  }

  return createPortal(
    <Box
      ref={ref}
      data-designer-library
      className={styles.designWindow}
      data-backdrop={node.overlay?.withBackdrop !== false}
      data-design-modal={node.id}
    >
      <DesignInteractionSurface>
        <Surface
          designMode
          opened
          closeLabel={translate('general.close')}
          title={node.label ?? ''}
          withBackdrop={node.overlay?.withBackdrop !== false}
          onClose={() => {}}
        >
          {children}
        </Surface>
      </DesignInteractionSurface>
    </Box>,
    host,
  )
}
