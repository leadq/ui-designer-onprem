import { Box } from '@root/components/common'
import { EmptyContainerHint } from '@root/components/common/EmptyContainerHint'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { getContainerContent } from '@root/utils/containerContent'
import { getNodeSizingStyle } from '@root/utils/layout/getNodeSizingStyle'
import { findNode } from '@root/utils/nodes'

import { PreviewNodeWrapper } from '../PreviewNodeWrapper'

export interface StaticNodeRendererProps {
  node: DesignNode
  selectedId: string | null
  onSelect: (id: string) => void
  hasEmptyHint?: boolean
}

// Static recursive renderer that doesn't use Dnd context
export const StaticNodeRenderer = ({
  node,
  selectedId,
  onSelect,
  hasEmptyHint = true,
}: StaticNodeRendererProps) => {
  const { translate } = useBuilderI18n()
  const meta = registry[node.type]

  if (!meta) {
    return <Box>{translate('slotBuilder.componentMissing')}</Box>
  }

  const Component = meta.renderer

  const contentProps = meta.collectionItem
    ? Object.fromEntries(
        Object.entries(node.props).filter(([key]) => !['label', 'disabled'].includes(key)),
      )
    : node.props

  const resolvedStyle = getNodeSizingStyle(node, undefined, null, registry)

  if (meta.collection) {
    return (
      <Component
        {...node.props}
        renderMode='design'
        style={resolvedStyle}
        collectionEntries={node.children.map((item) => ({
          id: item.id,
          props: item.props,
          content: (
            <PreviewNodeWrapper
              key={item.id}
              node={item}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ),
        }))}
        designItemId={
          node.children.find((item) => selectedId && findNode([item], selectedId))?.id ??
          node.props.initialItemId
        }
      />
    )
  }

  if (meta.isContainer) {
    const children =
      node.children.length > 0
        ? node.children.map((child) => (
            <PreviewNodeWrapper
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))
        : typeof node.props.children === 'string' || typeof node.props.children === 'number'
          ? node.props.children
          : null

    return (
      <Component {...contentProps} renderMode='design' style={resolvedStyle}>
        {getContainerContent(
          children,
          hasEmptyHint && meta.showEmptyPlaceholder ? (
            <EmptyContainerHint isSpacingHintVisible={selectedId === node.id} />
          ) : null,
        )}
      </Component>
    )
  }

  const tableProps =
    meta.tableContents && node.slots?.cellContents
      ? {
          cellContents: node.slots.cellContents.map((cell) => (
            <StaticNodeRenderer
              key={cell.id}
              hasEmptyHint={false}
              node={cell}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )),
        }
      : {}

  return (
    <Component
      {...(node.type === 'icon' ? { iconNodeId: node.id } : {})}
      {...node.props}
      {...tableProps}
      renderMode='design'
      style={resolvedStyle}
    />
  )
}
