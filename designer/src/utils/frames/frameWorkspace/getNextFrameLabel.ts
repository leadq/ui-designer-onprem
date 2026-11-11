import type { DesignNode } from '@root/types/document'

/** Number actual screens, regardless of their labels; overlays are not new frames. */
export const getNextFrameLabel = (
  nodes: DesignNode[],
  prefix = typeof localStorage !== 'undefined' &&
  localStorage.getItem('ui-builder-language') !== 'en'
    ? 'Yeni Frame'
    : 'New Frame',
): string => {
  const count = new Set(
    nodes.flatMap(
      (node) =>
        node.flow?.screens
          .filter((screen) => screen.kind === 'screen')
          .map((screen) => screen.nodeId) ?? [],
    ),
  ).size

  return count === 0 ? prefix : `${prefix} ${count + 1}`
}
