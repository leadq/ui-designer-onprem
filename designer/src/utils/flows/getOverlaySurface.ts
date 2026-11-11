import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

export const getOverlaySurface = (node: DesignNode, registry: Registry) =>
  registry[node.type]?.overlay?.Surface ??
  registry[node.overlay?.presentation ?? 'modal']?.overlay?.Surface
