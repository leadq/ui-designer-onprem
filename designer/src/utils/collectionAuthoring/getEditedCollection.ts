import type { Registry } from '@root/types/componentContract'
import type { DesignNode, SlotComponent } from '@root/types/document'
import { COLLECTION_MAX_ITEMS } from '@root/utils/collectionAuthoring/constants'
import { createNode } from '@root/utils/nodes'
import { getClonedNodesForReuse } from '@root/utils/nodes/getClonedNodesForReuse'
import { getMaterializedNodeForReuse } from '@root/utils/nodes/getMaterializedNodeForReuse'

import type { CollectionEdit } from './types'

export const getEditedCollection = (
  source: DesignNode,
  edit: CollectionEdit,
  registry: Registry,
  savedDesigns: SlotComponent[] = [],
): DesignNode => {
  const capability = registry[source.type]?.collection

  if (!capability) {
    return source
  }

  const children = [...source.children]
  const index = 'itemId' in edit ? children.findIndex((item) => item.id === edit.itemId) : -1

  if (edit.type !== 'add' && index < 0) {
    return source
  }

  if (edit.type === 'add' || edit.type === 'copy') {
    if (children.length >= COLLECTION_MAX_ITEMS) {
      return source
    }

    const previous =
      edit.type === 'copy' ? children[index] : capability.kind === 'list' ? children.at(-1) : null

    const item = previous
      ? getClonedNodesForReuse([getMaterializedNodeForReuse(previous, registry, savedDesigns)])[0]
      : createNode(registry, capability.itemType)

    if (!previous && capability.kind === 'tabs') {
      item.props.label = `Tab ${children.length + 1}`
    }

    children.splice(edit.type === 'copy' ? index + 1 : children.length, 0, item)
  } else if (edit.type === 'remove') {
    children.splice(index, 1)
  } else if (edit.type === 'up' || edit.type === 'down') {
    const destination = index + (edit.type === 'up' ? -1 : 1)

    if (destination < 0 || destination >= children.length) {
      return source
    }

    const previousItem = children[index]

    children[index] = children[destination]

    children[destination] = previousItem
  }

  const initialItemId = edit.type === 'initial' ? children[index].id : source.props.initialItemId

  return {
    ...source,
    children,
    props:
      capability.kind === 'tabs'
        ? {
            ...source.props,
            initialItemId: children.some((item) => item.id === initialItemId)
              ? initialItemId
              : (children[Math.min(Math.max(index, 0), children.length - 1)]?.id ?? ''),
          }
        : source.props,
  }
}
