import type { ReactNode } from 'react'
import { EmptyContainerHint } from '@root/components/common/EmptyContainerHint'
import { useDisclosureDesign } from '@root/hooks/useDisclosureDesign'
import { registry } from '@root/registry'
import type { RendererProps } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getContainerContent } from '@root/utils/containerContent'

import { DesignNodeWrapper } from '../DesignNodeWrapper'

export interface DisclosureNodeRendererProps {
  node: DesignNode
  rendererProps: RendererProps
  selectionProxyId?: string
  hasEmptyHint: boolean
  isSelected: boolean
}

export const DisclosureNodeRenderer = ({
  node,
  rendererProps,
  selectionProxyId,
  hasEmptyHint,
  isSelected,
}: DisclosureNodeRendererProps) => {
  const { isExpanded } = useDisclosureDesign(node)
  const Component = registry[node.type].renderer

  const children = node.children.length
    ? node.children.map((child) => (
        <DesignNodeWrapper
          key={child.id}
          layoutParent={node}
          node={child}
          selectionProxyId={selectionProxyId}
        />
      ))
    : (rendererProps.children as ReactNode)

  return (
    <Component {...rendererProps} designExpanded={isExpanded}>
      {getContainerContent(
        children,
        rendererProps.renderMode === 'design' && hasEmptyHint ? (
          <EmptyContainerHint isSpacingHintVisible={isSelected} />
        ) : null,
      )}
    </Component>
  )
}
