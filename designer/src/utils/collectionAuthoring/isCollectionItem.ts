import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { findNode } from '@root/utils/nodes'

export const isCollectionItem = (nodes: DesignNode[], id: string): boolean =>
  Boolean(registry[findNode(nodes, id)?.type ?? '']?.collectionItem)
