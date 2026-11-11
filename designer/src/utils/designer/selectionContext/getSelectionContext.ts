import { getAdapter } from '@root/adapters'
import type { DesignNode } from '@root/types/document'
import { getColorTokenStyle } from '@root/utils/colorTokens/getColorTokenStyle'
import { parseDesignDocument } from '@root/utils/designDocument'
import { getFrameForNode } from '@root/utils/frames/frameWorkspace'
import { getNodeSizingStyle } from '@root/utils/layout/getNodeSizingStyle'
import { getStyleAtWidth } from '@root/utils/layout/getStyleAtWidth'
import { findNode, findParent } from '@root/utils/nodes'
import { getPropsAtWidth } from '@root/utils/responsive/getPropsAtWidth'

export const getSelectionContext = (input: unknown, ids: string[], width: number | null) => {
  const document = parseDesignDocument(input)
  const registry = getAdapter(document.adapterId).registry

  const getBrief = (node: DesignNode) => ({
    id: node.id,
    type: node.type,
    label: node.label,
    text: node.props.children,
    fieldLabel: node.props.label,
  })

  const getDescribe = (node: DesignNode) => {
    const meta = registry[node.type]
    const parent = findParent(document.nodes, node.id)

    return {
      ...getBrief(node),
      props: node.props,
      style: node.style,
      styleTokens: node.styleTokens,
      responsiveStyleTokens: node.responsiveStyleTokens,
      responsiveStyles: node.responsiveStyles,
      responsiveProps: node.responsiveProps,
      effectiveProps: getPropsAtWidth(node, width, meta),
      effectiveStyle: {
        ...getStyleAtWidth(node, width, {
          ...meta?.defaultStyle,
          ...meta?.getDefaultLayoutStyle?.(getPropsAtWidth(node, width, meta)),
        }),
        ...getColorTokenStyle(node, width, registry),
      },
      resolvedSizingStyle: getNodeSizingStyle(node, parent ?? undefined, width, registry),
      children: node.children.map(getBrief),
      slots: Object.fromEntries(
        Object.entries(node.slots ?? {}).map(([name, children]) => [name, children.map(getBrief)]),
      ),
    }
  }

  return ids.map((id) => {
    const node = findNode(document.nodes, id)

    if (!node) {
      return { id, missing: true }
    }

    const parent = findParent(document.nodes, id)
    const path = [getBrief(node)]
    let ancestor = parent

    while (ancestor) {
      path.unshift(getBrief(ancestor))

      ancestor = findParent(document.nodes, ancestor.id)
    }

    const slotName = parent
      ? Object.entries(parent.slots ?? {}).find(([, children]) =>
          children.some((child) => child.id === id),
        )?.[0]
      : undefined

    const siblings = parent
      ? slotName
        ? parent.slots![slotName]
        : parent.children
      : document.nodes

    return {
      node: getDescribe(node),
      parent: parent ? getDescribe(parent) : null,
      path,
      frameId: getFrameForNode(document.nodes, id)?.id,
      slotName,
      siblings: siblings.map(getBrief),
      advice:
        'For space between siblings inspect parent gap and breakpoint. Edit authored style/props, never copy resolvedSizingStyle back to JSON.',
    }
  })
}
