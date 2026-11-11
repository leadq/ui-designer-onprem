import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

export const getCollectionItemLabel = (node: DesignNode, registry: Registry): string | undefined =>
  registry[node.type]?.collectionItem === 'tabs' ? String(node.props.label) : undefined
