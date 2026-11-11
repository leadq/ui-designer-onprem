import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

export const getResolvedExportConfig = (node: DesignNode, registry: Registry) => {
  const config = registry[node.type]?.exportConfig

  return config?.resolve?.(node) ?? config
}
