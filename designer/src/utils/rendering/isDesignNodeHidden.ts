import type { DesignNode } from '@root/types/document'

import { getRenderTreeIndex } from './getRenderTreeIndex'

export const isDesignNodeHidden = (
  nodes: DesignNode[],
  node: DesignNode,
  editingScreenId: string | null,
  isPreview: boolean,
): boolean => {
  if (isPreview) {
    return false
  }

  const index = getRenderTreeIndex(nodes)
  const owner = editingScreenId ? index.owners.get(editingScreenId) : undefined

  if (!owner || owner.flow?.layout === 'root') {
    return false
  }

  const frameId =
    (editingScreenId ? index.nodes.get(editingScreenId)?.overlay?.ownerFrameId : null) ??
    editingScreenId

  const isWindowVisible =
    node.overlay &&
    (node.id === editingScreenId ||
      (node.overlay.ownerFrameId === frameId && node.overlay.initiallyOpen))

  return Boolean(
    (index.owners.has(node.id) && node.id !== frameId && !isWindowVisible) ||
    (node.flow && node.id !== owner.id),
  )
}
