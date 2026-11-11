import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { COLLECTION_MAX_ITEMS } from '@root/utils/collectionAuthoring/constants'

export const validateCollection = (
  node: DesignNode,
  registry: Registry,
  parent?: DesignNode,
): void => {
  const meta = registry[node.type]
  const capability = meta?.collection

  if (meta?.collectionItem && registry[parent?.type ?? '']?.collection?.itemType !== node.type) {
    throw new Error(`${node.id}: collection item requires its registered parent`)
  }

  if (meta?.collectionItem === 'tabs' && typeof node.props.label !== 'string') {
    throw new Error(`${node.id}: tab title must be text`)
  }

  if (!capability) {
    return
  }

  if (
    node.children.length > COLLECTION_MAX_ITEMS ||
    node.children.some((item) => item.type !== capability.itemType)
  ) {
    throw new Error(`${node.id}: collection requires at most 100 registered items`)
  }

  if (capability.kind === 'tabs') {
    const initial = node.props.initialItemId

    if (
      typeof initial !== 'string' ||
      (node.children.length ? !node.children.some((item) => item.id === initial) : initial !== '')
    ) {
      throw new Error(
        `${node.id}: initialItemId must reference an owned tab (empty string only for empty tabs)`,
      )
    }
  }
}
