import type { MouseEvent } from 'react'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { getCanvasElementsFromPoint } from '@root/utils/canvas/hitTesting'
import { findNode } from '@root/utils/nodes'

import { findNodeToSelect } from './hitSelection'
import { isCanvasControl } from './isCanvasControl'

export const handleCanvasDoubleClick = (event: MouseEvent) => {
  if (useEditorStore.getState().previewMode || isCanvasControl(event.target)) {
    return
  }

  const iconRoot = getCanvasElementsFromPoint(event.clientX, event.clientY)
    .map((element) => element.closest<HTMLElement>('[data-icon-editor]'))
    .find((element) => element?.dataset.iconEditor)

  if (iconRoot?.dataset.iconEditor) {
    event.preventDefault()

    event.stopPropagation()

    useEditorStore.getState().setSelectedNodeIds([iconRoot.dataset.iconEditor])

    iconRoot.dispatchEvent(new Event('designer:edit-icon'))

    return
  }

  event.preventDefault()

  event.stopPropagation()

  const {
    nodes: freshNodes,
    focusedContainerId: currentFocus,
    setSelectedNodeIds,
    setFocusedContainer,
  } = useEditorStore.getState()

  const nodeToEnterId = findNodeToSelect(event.clientX, event.clientY, currentFocus, freshNodes)

  if (!nodeToEnterId) {
    return
  }

  const clickedNode = findNode(freshNodes, nodeToEnterId)

  if (!clickedNode) {
    return
  }

  const isContainer = registry[clickedNode.type]?.isContainer ?? false

  if (isContainer) {
    setFocusedContainer(nodeToEnterId)

    if (clickedNode.children && clickedNode.children.length > 0) {
      const childId = findNodeToSelect(event.clientX, event.clientY, nodeToEnterId, freshNodes)

      if (childId) {
        setSelectedNodeIds([childId])
      } else {
        setSelectedNodeIds([clickedNode.children[0].id])
      }
    } else {
      setSelectedNodeIds([])
    }
  } else {
    setSelectedNodeIds([nodeToEnterId])
  }
}
