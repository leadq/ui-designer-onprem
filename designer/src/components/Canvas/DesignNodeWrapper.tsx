import { memo, useCallback, useLayoutEffect } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useCanvasView } from '@root/contexts/CanvasViewContext/hooks/useCanvasView'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { registerDesignDrag } from '@root/utils/canvas/drag/registerDesignDrag'
import { getRenderTreeIndex } from '@root/utils/rendering/getRenderTreeIndex'

import { PreviewWindow } from '../Flows/PreviewWindow'

import { NodeRenderer } from './NodeRenderer'

interface DesignNodeWrapperProps {
  node: DesignNode
  layoutParent?: DesignNode
  selectionProxyId?: string
}

/**
 * Wraps NodeRenderer with dnd-kit draggable and droppable logic.
 * Uses "display: contents" so the wrapper doesn't affect layout.
 * Passes isDragging to NodeRenderer so visual feedback can be applied
 * on the actual rendered element (display:contents ignores opacity/transform).
 */
export const DesignNodeWrapper = memo(
  ({ node, layoutParent, selectionProxyId }: DesignNodeWrapperProps) => {
    const view = useCanvasView()
    const dragId = view ? `${view.id}::${node.id}` : node.id
    const hasMultipleSelection = useEditorStore((state) => state.selectedNodeIds.length > 1)
    const isPreviewMode = useEditorStore((state) => state.previewMode)
    const isFrame = useEditorStore((state) => getRenderTreeIndex(state.nodes).frames.has(node.id))
    const isWindow = useEditorStore((state) => getRenderTreeIndex(state.nodes).windows.has(node.id))
    const meta = registry[node.type]
    const isCellRoot = useEditorStore((state) => getRenderTreeIndex(state.nodes).cells.has(node.id))

    const isCollectionRoot = useEditorStore((state) =>
      getRenderTreeIndex(state.nodes).collectionItems.has(node.id),
    )

    const isDragDisabled =
      Boolean(selectionProxyId) ||
      isPreviewMode ||
      isFrame ||
      isCellRoot ||
      isCollectionRoot ||
      hasMultipleSelection

    const {
      attributes,
      listeners,
      setNodeRef: setDraggableRef,
      isDragging,
    } = useDraggable({
      id: dragId,
      data: node,
      disabled: isDragDisabled,
    })

    useLayoutEffect(() => {
      if (isDragDisabled || !listeners?.onPointerDown) {
        return
      }

      return registerDesignDrag(dragId, (event) => listeners.onPointerDown(event))
    }, [dragId, isDragDisabled, listeners])

    const { setNodeRef: setDroppableRef } = useDroppable({
      id: dragId,
      disabled: Boolean(selectionProxyId) || isPreviewMode || !meta?.isContainer,
      data: node,
    })

    const setRefs = useCallback(
      (element: HTMLElement | null) => {
        setDraggableRef(element)

        setDroppableRef(element)
      },
      [setDraggableRef, setDroppableRef],
    )

    const content = (
      <NodeRenderer
        ref={selectionProxyId ? undefined : setRefs}
        hasEmptyHint={!isCellRoot}
        isDragging={isDragging}
        layoutParent={layoutParent}
        node={node}
        selectionProxyId={selectionProxyId}
      />
    )

    return (
      <div
        {...(isDragDisabled ? {} : listeners)}
        {...(isDragDisabled ? {} : attributes)}
        style={{
          position: 'relative',
          display: 'contents',
        }}
      >
        {isWindow ? <PreviewWindow node={node}>{content}</PreviewWindow> : content}
      </div>
    )
  },
)

DesignNodeWrapper.displayName = 'DesignNodeWrapper'
