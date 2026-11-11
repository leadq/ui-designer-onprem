import { useState } from 'react'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { cloneNodesForReuse, getSavedDesignUsageCount } from '@root/utils/nodes'

export const useSavedDesignActions = () => {
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null)
  const [deletingDesignId, setDeletingDesignId] = useState<string | null>(null)
  const savedDesigns = useEditorStore((state) => state.slotComponents)
  const pageNodes = useEditorStore((state) => state.nodes)
  const updateSlotComponent = useEditorStore((state) => state.updateSlotComponent)
  const deleteSlotComponent = useEditorStore((state) => state.deleteSlotComponent)
  const editingDesign = savedDesigns.find((design) => design.id === editingDesignId)
  const deletingDesign = savedDesigns.find((design) => design.id === deletingDesignId)

  const deleteUseCount = deletingDesignId
    ? getSavedDesignUsageCount(pageNodes, deletingDesignId, registry) +
      savedDesigns.reduce(
        (count, item) => count + getSavedDesignUsageCount(item.nodes, deletingDesignId, registry),
        0,
      )
    : 0

  const handleConfirmDelete = () => {
    if (!deletingDesign || deleteUseCount > 0) {
      return
    }

    deleteSlotComponent(deletingDesign.id)

    setDeletingDesignId(null)
  }

  const handleApplyEdit = (nodes: DesignNode[], name: string) => {
    if (!editingDesignId || !name.trim()) {
      return
    }

    updateSlotComponent(editingDesignId, name.trim(), cloneNodesForReuse(nodes))

    setEditingDesignId(null)
  }

  return {
    savedDesigns,
    editingDesign,
    setEditingDesignId,
    handleApplyEdit,
    deletingDesign,
    setDeletingDesignId,
    deleteUseCount,
    handleConfirmDelete,
  }
}
