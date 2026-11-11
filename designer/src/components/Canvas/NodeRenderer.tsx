import { forwardRef, memo } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'
import { getContainerContent } from '@root/utils/containerContent'

import { Box } from '../common'
import { EmptyContainerHint } from '../common/EmptyContainerHint'

import { useForwardedRootRef } from './hooks/useForwardedRootRef'
import { useNodeRendererState } from './hooks/useNodeRendererState'
import { CollectionNodeRenderer } from './CollectionNodeRenderer'
import { DesignNodeWrapper } from './DesignNodeWrapper'
import { DisclosureNodeRenderer } from './DisclosureNodeRenderer'

interface NodeRendererProps {
  node: DesignNode
  layoutParent?: DesignNode
  isDragging?: boolean
  hasEmptyHint?: boolean
  selectionProxyId?: string
}

/**
 * Recursive component that renders a DesignNode and its children.
 * Adapters bind the root class, node identity, style and ref to the same DOM root.
 */
// React memo + forwardRef compose one component while preserving the adapter DOM ref.
// eslint-disable-next-line react/no-multi-comp
export const NodeRenderer = memo(
  forwardRef<HTMLElement, NodeRendererProps>(
    ({ node, layoutParent, isDragging = false, selectionProxyId, hasEmptyHint = true }, ref) => {
      const setRootRef = useForwardedRootRef(ref)
      const { translate } = useBuilderI18n()

      const {
        meta,
        isSelected,
        previewMode,
        boundProps,
        slotElements,
        rootClassName,
        componentProps,
        interactionProps,
        mergedStyle,
      } = useNodeRendererState(node, layoutParent, isDragging, selectionProxyId)

      if (!meta) {
        return (
          <Box>
            {translate('canvas.componentMissing')}: &quot;{node.type}&quot;
          </Box>
        )
      }

      const Component = meta.renderer

      const tableProps =
        meta.tableContents && node.slots?.cellContents
          ? {
              cellContents: node.slots.cellContents.map((cell) => (
                <DesignNodeWrapper key={cell.id} node={cell} selectionProxyId={selectionProxyId} />
              )),
            }
          : {}

      if (meta.collectionItem) {
        delete componentProps.label

        delete componentProps.disabled
      }

      const rendererProps = {
        ...componentProps,
        ...slotElements,
        ...interactionProps,
        'data-node-id': selectionProxyId ?? node.id,
        renderMode: previewMode ? ('preview' as const) : ('design' as const),
        rootClassName,
        rootRef: setRootRef,
        style: mergedStyle,
      }

      if (meta.collection) {
        return (
          <CollectionNodeRenderer
            node={node}
            rendererProps={rendererProps}
            selectionProxyId={selectionProxyId}
          />
        )
      }

      if (meta.disclosure) {
        return (
          <DisclosureNodeRenderer
            key={`${previewMode}:${String(boundProps[meta.disclosure.initialExpandedProp])}`}
            hasEmptyHint={hasEmptyHint}
            isSelected={isSelected}
            node={node}
            rendererProps={rendererProps}
            selectionProxyId={selectionProxyId}
          />
        )
      }

      if (meta.isContainer) {
        const children =
          node.children.length > 0
            ? node.children.map((child) => (
                <DesignNodeWrapper
                  key={child.id}
                  layoutParent={node}
                  node={child}
                  selectionProxyId={selectionProxyId}
                />
              ))
            : typeof boundProps.children === 'string' || typeof boundProps.children === 'number'
              ? boundProps.children
              : null

        return (
          <Component
            key={
              meta.previewValue
                ? `${previewMode}:${String(boundProps[meta.previewValue.defaultProp])}`
                : undefined
            }
            {...rendererProps}
          >
            {getContainerContent(
              children,
              !previewMode && hasEmptyHint && meta.showEmptyPlaceholder ? (
                <EmptyContainerHint isSpacingHintVisible={isSelected} />
              ) : null,
            )}
          </Component>
        )
      }

      return (
        <Component
          key={
            meta.previewValue
              ? `${previewMode}:${String(boundProps[meta.previewValue.defaultProp])}`
              : undefined
          }
          {...rendererProps}
          {...tableProps}
        />
      )
    },
  ),
)

NodeRenderer.displayName = 'NodeRenderer'
