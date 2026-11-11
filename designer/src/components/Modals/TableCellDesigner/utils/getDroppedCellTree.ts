import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { findNode, findParent } from '@root/utils/nodes'
import { produce } from 'immer'

const canInsertCellChild = (node: DesignNode): boolean =>
  Boolean(registry[node.type]?.isContainer && !registry[node.type]?.collection)

/** A drop inside a container appends; a drop on a leaf inserts after that leaf. */
export const getDroppedCellTree = (
  root: DesignNode,
  targetId: string,
  added: DesignNode,
  isMove: boolean,
): DesignNode => {
  const target = findNode([root], targetId)
  const parent = target && (canInsertCellChild(target) ? target : findParent([root], target.id))
  const previousParent = findParent([root], added.id)

  if (
    !target ||
    !parent ||
    !canInsertCellChild(parent) ||
    added.id === root.id ||
    (isMove &&
      (!previousParent?.children.some((node) => node.id === added.id) ||
        registry[previousParent.type]?.collection ||
        findNode([added], targetId)))
  ) {
    return root
  }

  return produce(root, (draft) => {
    if (isMove && previousParent) {
      const previous = findNode([draft], previousParent.id)!

      previous.children = previous.children.filter((node) => node.id !== added.id)
    }

    const destination = findNode([draft], parent.id)!

    const index =
      target.id === parent.id
        ? destination.children.length
        : destination.children.findIndex((node) => node.id === target.id) + 1

    destination.children.splice(index, 0, added)
  })
}
