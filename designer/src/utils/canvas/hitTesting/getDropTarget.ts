import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getFrameIds, hasRootFrames } from '@root/utils/frames/frameWorkspace'
import { findNode, isDescendant } from '@root/utils/nodes'

import { DEFAULT_EDGE_RATIO, DWELL_EDGE_RATIO, MAX_EDGE_THRESHOLD_PX } from './constants'
import { getCanvasElementsFromPoint } from './getCanvasElementsFromPoint'
import { getNodeDropAxis } from './getNodeDropAxis'
import { getNodeRect } from './getNodeRect'
import { resolveNodeId } from './resolveNodeId'
import type { DropTarget } from './types'

const HALF_SIZE_DIVISOR = 2

const isPointInside = (rect: DOMRect, positionX: number, positionY: number): boolean =>
  positionX >= rect.left &&
  positionX <= rect.right &&
  positionY >= rect.top &&
  positionY <= rect.bottom

export const getDropTarget = (
  mouseX: number,
  mouseY: number,
  nodes: DesignNode[],
  componentRegistry: Registry,
  activeId?: string,
  dwellContainerId?: string,
): DropTarget | null => {
  const layer = document.getElementById('render-layer')
  const viewport = document.getElementById('canvas-scroll-container')

  if (!layer || !viewport || !isPointInside(viewport.getBoundingClientRect(), mouseX, mouseY)) {
    return null
  }

  const stack = getCanvasElementsFromPoint(mouseX, mouseY)

  // Respect clipping, stacking order and adapter-owned inner wrappers.
  if (!stack.some((element) => element === layer || layer.contains(element))) {
    return null
  }

  const viewId = stack
    .find((element) => element.closest('[data-view-id]'))
    ?.closest<HTMLElement>('[data-view-id]')?.dataset.viewId

  const frameIds = getFrameIds(nodes)

  if (hasRootFrames(nodes) && activeId && frameIds.has(activeId)) {
    return null
  }

  const activeNode = activeId ? findNode(nodes, activeId) : null
  const dwellNode = dwellContainerId ? findNode(nodes, dwellContainerId) : null

  if (dwellContainerId) {
    const rect = getNodeRect(dwellContainerId, viewId)

    if (!dwellNode || !rect || !isPointInside(rect, mouseX, mouseY)) {
      return null
    }
  }

  const directIds = dwellNode ? new Set(dwellNode.children.map((child) => child.id)) : null
  const seen = new Set<string>()
  let hasActiveHit = false

  for (const element of stack) {
    if (!layer.contains(element)) {
      continue
    }

    const id = resolveNodeId(element)

    if (!id || seen.has(id)) {
      continue
    }

    seen.add(id)

    if (id === activeId || (activeNode && isDescendant(activeNode, id))) {
      hasActiveHit = true

      continue
    }

    if (directIds && !directIds.has(id)) {
      continue
    }

    const node = findNode(nodes, id)
    const rect = getNodeRect(id, viewId)

    if (!node || !rect || !isPointInside(rect, mouseX, mouseY)) {
      continue
    }

    if (hasRootFrames(nodes) && frameIds.has(id)) {
      return { targetId: id, position: 'inside' }
    }

    const axis = getNodeDropAxis(id, nodes, viewId)
    const length = axis === 'x' ? rect.width : rect.height
    const offset = axis === 'x' ? mouseX - rect.left : mouseY - rect.top

    if (componentRegistry[node.type]?.isContainer) {
      const threshold = Math.min(
        length * (dwellNode ? DWELL_EDGE_RATIO : DEFAULT_EDGE_RATIO),
        MAX_EDGE_THRESHOLD_PX,
      )

      if (offset < threshold) {
        return { targetId: id, position: 'before' }
      }

      if (offset > length - threshold) {
        return { targetId: id, position: 'after' }
      }

      return { targetId: id, position: 'inside' }
    }

    return { targetId: id, position: offset < length / HALF_SIZE_DIVISOR ? 'before' : 'after' }
  }

  if (hasActiveHit) {
    return null
  }

  if (dwellNode) {
    return { targetId: dwellNode.id, position: 'inside' }
  }

  if (hasRootFrames(nodes)) {
    return null
  }

  return isPointInside(layer.getBoundingClientRect(), mouseX, mouseY)
    ? { targetId: 'canvas-root', position: 'inside' }
    : null
}
