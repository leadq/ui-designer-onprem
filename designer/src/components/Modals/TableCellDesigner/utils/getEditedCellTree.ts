import type { DesignNode } from '@root/types/document'
import { findNode } from '@root/utils/nodes'
import { produce } from 'immer'

export const getEditedCellTree = (
  root: DesignNode,
  id: string,
  update: (node: DesignNode) => void,
): DesignNode =>
  produce(root, (draft) => {
    const node = findNode([draft], id)

    if (node) {
      update(node)
    }
  })
