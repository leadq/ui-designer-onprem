import { useCallback } from 'react'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { getNodeSizingStyle } from '@root/utils/layout/getNodeSizingStyle'
import { getPropsAtWidth } from '@root/utils/responsive/getPropsAtWidth'
import { getSlotRenderMode } from '@root/utils/slotRendering'

import styles from './styles.module.scss'

export interface CellDraftNodeProps {
  node: DesignNode
  parent?: DesignNode
  width: number
  selectedId: string
}

export const CellDraftNode = ({ node, parent, width, selectedId }: CellDraftNodeProps) => {
  const meta = registry[node.type]

  const handleRootRef = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        element.setAttribute('data-cell-node', node.id)

        element.draggable = true

        element.tabIndex = -1

        element
          .querySelectorAll<HTMLElement>('button, input, select, textarea, a, [tabindex]')
          .forEach((control) => {
            control.tabIndex = -1
          })
      }
    },
    [node.id],
  )

  if (!meta) {
    return null
  }

  const Component = meta.renderer
  const props = getPropsAtWidth(node, width, meta)

  const renderChild = (child: DesignNode) => (
    <CellDraftNode
      key={child.id}
      node={child}
      parent={node}
      selectedId={selectedId}
      width={width}
    />
  )

  const slots = Object.fromEntries(
    meta.propsSchema
      .filter((schema) => schema.type === 'slot' && schema.key !== 'cellContents')
      .map((schema) => {
        const content = (node.slots?.[schema.key] ?? []).map(renderChild)

        return [schema.key, getSlotRenderMode(schema) === 'callback' ? () => content : content]
      }),
  )

  if (meta.collectionItem) {
    delete props.label

    delete props.disabled
  }

  return (
    <Component
      {...props}
      {...slots}
      {...(meta.tableContents ? { cellContents: node.slots?.cellContents?.map(renderChild) } : {})}
      {...(meta.collection
        ? {
            collectionEntries: node.children.map((child) => ({
              id: child.id,
              props: child.props,
              content: renderChild(child),
            })),
            designItemId: props.initialItemId,
          }
        : {})}
      {...(node.type === 'icon' ? { iconNodeId: node.id } : {})}
      renderMode='design'
      rootRef={handleRootRef}
      style={getNodeSizingStyle(node, parent, width, registry)}
      rootClassName={[
        styles.cellDraftNode,
        selectedId === node.id ? styles['cellDraftNode--selected'] : '',
        meta.isContainer && !node.children.length ? styles['cellDraftNode--empty'] : '',
      ].join(' ')}
      {...(meta.isContainer && !meta.collection
        ? { children: node.children.length ? node.children.map(renderChild) : props.children }
        : {})}
    />
  )
}
