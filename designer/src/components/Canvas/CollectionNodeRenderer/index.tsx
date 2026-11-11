import { registry } from '@root/registry'
import type { RendererProps } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { DesignNodeWrapper } from '../DesignNodeWrapper'
import { useCollectionSelection } from '../hooks/useCollectionSelection'

export interface CollectionNodeRendererProps {
  node: DesignNode
  selectionProxyId?: string
  rendererProps: RendererProps
}

const EMPTY_GUIDE_HEIGHT = 160

export const CollectionNodeRenderer = ({
  node,
  selectionProxyId,
  rendererProps,
}: CollectionNodeRendererProps) => {
  const designItemId = useCollectionSelection(node)
  const Component = registry[node.type].renderer

  return (
    <Component
      key={`${rendererProps.renderMode}:${String(node.props.initialItemId)}`}
      {...rendererProps}
      data-node-id={selectionProxyId ?? node.id}
      designItemId={designItemId}
      collectionEntries={node.children.map((item) => ({
        id: item.id,
        props: item.props,
        content: (
          <DesignNodeWrapper key={item.id} node={item} selectionProxyId={selectionProxyId} />
        ),
      }))}
      style={{
        ...rendererProps.style,
        ...(!node.children.length && rendererProps.renderMode === 'design'
          ? { minHeight: EMPTY_GUIDE_HEIGHT }
          : {}),
      }}
    />
  )
}
