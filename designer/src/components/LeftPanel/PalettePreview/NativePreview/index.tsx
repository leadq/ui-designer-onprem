import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getNodeSizingStyle } from '@root/utils/layout/getNodeSizingStyle'

export interface NativePreviewProps {
  node: DesignNode
  registry: Registry
}

export const NativePreview = ({ node, registry }: NativePreviewProps) => {
  const meta = registry[node.type]
  const Component = meta.renderer

  const renderNode = (child: DesignNode) => (
    <NativePreview key={child.id} node={child} registry={registry} />
  )

  const children = node.children.length ? node.children.map(renderNode) : node.props.children

  const extra = meta.collection
    ? {
        collectionEntries: node.children.map((item) => ({
          id: item.id,
          props: item.props,
          content: renderNode(item),
        })),
        designItemId: node.props.initialItemId ?? node.children[0]?.id,
      }
    : meta.tableContents
      ? { cellContents: node.slots?.cellContents?.map(renderNode) }
      : {}

  const props = meta.collectionItem
    ? Object.fromEntries(
        Object.entries(node.props).filter(([key]) => !['label', 'disabled'].includes(key)),
      )
    : node.props

  return (
    <Component
      {...props}
      {...extra}
      renderMode='design'
      style={getNodeSizingStyle(node, undefined, null, registry)}
    >
      {children as React.ReactNode}
    </Component>
  )
}
