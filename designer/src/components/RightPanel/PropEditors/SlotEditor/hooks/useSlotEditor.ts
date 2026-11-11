import { useState } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { findNode } from '@root/utils/nodes'
import { v4 as uuidv4 } from 'uuid'

export const useSlotEditor = (parentNodeId: string, slotKey: string) => {
  const { translate } = useBuilderI18n()
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  // Fetch store values dynamically
  const parentNode = useEditorStore((state) => findNode(state.nodes, parentNodeId))
  const slotComponents = useEditorStore((state) => state.slotComponents)
  const updateProps = useEditorStore((state) => state.updateProps)
  const createSlotComponent = useEditorStore((state) => state.createSlotComponent)
  const updateSlotComponent = useEditorStore((state) => state.updateSlotComponent)
  // Get selected slot component ID from parent node props
  const selectedComponentId = parentNode?.props[slotKey] as string | undefined
  const boundComponent = slotComponents.find((child) => child.id === selectedComponentId)

  const handleSelectComponent = (componentId: string) => {
    updateProps(parentNodeId, slotKey, componentId || undefined)
  }

  const handleOpenEdit = () => {
    if (!boundComponent) {
      return
    }

    setIsCreatingNew(false)

    setIsBuilderOpen(true)
  }

  const handleOpenCreate = () => {
    setIsCreatingNew(true)

    setIsBuilderOpen(true)
  }

  const handleApplyComponent = (newNodes: DesignNode[], name: string) => {
    const componentName = name.trim() || translate('leftPanel.slot.untitled')

    if (isCreatingNew) {
      const newId = uuidv4()

      createSlotComponent(newId, componentName, newNodes)

      // Auto-bind created slot component
      updateProps(parentNodeId, slotKey, newId)
    } else if (boundComponent) {
      updateSlotComponent(boundComponent.id, componentName, newNodes)
    }

    setIsBuilderOpen(false)
  }

  const handleOpenEditClick = handleOpenEdit
  const handleOpenCreateClick = handleOpenCreate
  const handleApplyComponentApply = handleApplyComponent
  const handleCloseBuilder = () => setIsBuilderOpen(false)

  return {
    isBuilderOpen,
    isCreatingNew,
    slotComponents,
    selectedComponentId,
    boundComponent,
    handleSelectComponent,
    handleOpenEditClick,
    handleOpenCreateClick,
    handleApplyComponentApply,
    handleCloseBuilder,
  }
}
