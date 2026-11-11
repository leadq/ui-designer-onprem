import type { DesignNode } from '@root/types/document'

export const getToggleTargetIds = (binding: DesignNode['toggleBinding']): string[] => [
  ...new Set([
    ...(binding?.visibleNodeId ? [binding.visibleNodeId] : []),
    ...(binding?.visibleNodeIds ?? []),
  ]),
]
