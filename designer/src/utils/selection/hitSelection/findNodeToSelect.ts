import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { getCanvasElementsFromPoint, resolveNodeId } from '@root/utils/canvas/hitTesting'
import { findNode } from '@root/utils/nodes'

export const findNodeToSelect = (
  clientX: number,
  clientY: number,
  focusedId: string | null,
  allNodes: DesignNode[],
): string | null => {
  const elements = getCanvasElementsFromPoint(clientX, clientY)

  // Adapter-owned trigger identity selects a logical tab even while native content is inert.
  for (const element of elements) {
    if (!document.getElementById('render-layer')?.contains(element)) {
      continue
    }

    const header = element.closest('button[aria-expanded], [role="button"][aria-expanded]')

    const disclosure = header?.matches('[data-disclosure-trigger]')
      ? header
      : header?.querySelector('[data-disclosure-trigger]')

    const disclosureId = disclosure?.getAttribute('data-disclosure-trigger')
    const disclosureNode = disclosureId ? findNode(allNodes, disclosureId) : null

    if (disclosureNode && registry[disclosureNode.type]?.disclosure) {
      return disclosureNode.id
    }

    const trigger = element.closest('[role="tab"]')

    const marker = trigger?.matches('[data-collection-trigger]')
      ? trigger
      : trigger?.querySelector('[data-collection-trigger]')

    const itemId = marker?.getAttribute('data-collection-trigger')

    if (itemId && findNode(allNodes, itemId)) {
      return itemId
    }
  }

  const resolvedIds: string[] = []
  const seen = new Set<string>()

  for (const el of elements) {
    const id = resolveNodeId(el)

    if (id && !seen.has(id)) {
      seen.add(id)

      resolvedIds.push(id)
    }
  }

  if (!focusedId) {
    // Frames are editing contexts: their children form the first selectable level.
    const rootIds = new Set(
      allNodes.flatMap((node) =>
        node.type === 'designerFrame'
          ? node.children.map((child) => child.id)
          : node.type === 'designerFlow'
            ? []
            : [node.id],
      ),
    )

    for (const id of resolvedIds) {
      if (rootIds.has(id)) {
        return id
      }
    }
  } else {
    const focusedNode = findNode(allNodes, focusedId)

    if (focusedNode) {
      const directChildrenIds = new Set(focusedNode.children.map((child) => child.id))

      for (const id of resolvedIds) {
        if (directChildrenIds.has(id)) {
          return id
        }
      }
    }
  }

  return null
}
