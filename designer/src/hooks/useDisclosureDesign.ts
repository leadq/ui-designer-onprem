import { useEffect } from 'react'
import { useDisclosureDesignStore } from '@root/stores/disclosureDesignStore'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { findNode } from '@root/utils/nodes'

export const useDisclosureDesign = (node: DesignNode | null) => {
  const adapterId = useEditorStore((state) => state.adapterId)
  const key = `${adapterId}:${node?.id ?? ''}`
  const isCollapsed = useDisclosureDesignStore((state) => Boolean(state.collapsed[key]))
  const setExpanded = useDisclosureDesignStore((state) => state.setExpanded)

  const hasSelectedChild = useEditorStore((state) =>
    Boolean(node && state.selectedNodeIds.some((id) => id !== node.id && findNode([node], id))),
  )

  useEffect(() => {
    if (node && isCollapsed && hasSelectedChild) {
      setExpanded(key, true)
    }
  }, [node, isCollapsed, hasSelectedChild, key, setExpanded])

  return {
    isExpanded: !isCollapsed || hasSelectedChild,
    setExpanded: (isExpanded: boolean) => setExpanded(key, isExpanded),
  }
}
