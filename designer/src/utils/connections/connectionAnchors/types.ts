import type { DesignNode } from '@root/types/document'

export interface ConnectionAnchor {
  node: DesignNode
  via: DesignNode[]
  isConditional: boolean
}
