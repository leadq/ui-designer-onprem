import type { DesignNode } from '@root/types/document'

import { getClonedNodesForReuse } from './getClonedNodesForReuse'

/**
 * Recursively clones a node and its children, generating new IDs for everyone, including slot nodes.
 */
export const cloneNodeWithNewIds = (node: DesignNode): DesignNode =>
  getClonedNodesForReuse([node])[0]
