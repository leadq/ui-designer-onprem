import { useState } from 'react'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { findNode } from '@root/utils/nodes'

export const useCollectionSelection = (node: DesignNode) => {
  const selectedId = useEditorStore((state) => state.selectedNodeIds[0])
  const selectedItem = node.children.find((item) => selectedId && findNode([item], selectedId))?.id
  const [previous, setPrevious] = useState(selectedItem)

  if (selectedItem && selectedItem !== previous) {
    setPrevious(selectedItem)
  }

  return node.children.some((item) => item.id === previous)
    ? previous
    : String(node.props.initialItemId ?? node.children[0]?.id ?? '')
}
