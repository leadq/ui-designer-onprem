import { useCallback, useRef, useState } from 'react'
import { useEditorStore } from '@root/stores/editor'

const RENAME_FOCUS_DELAY_MS = 50

/**
 * Encapsulates selection, context menu, label editing, and expand/collapse
 * logic for a single TreeNode item.
 */
export const useTreeNode = (nodeId: string, displayName: string) => {
  const selectedNodeIds = useEditorStore((state) => state.selectedNodeIds)
  const setSelectedNodeIds = useEditorStore((state) => state.setSelectedNodeIds)
  const toggleNodeSelection = useEditorStore((state) => state.toggleNodeSelection)
  const updateNodeLabel = useEditorStore((state) => state.updateNodeLabel)
  const isPreviewMode = useEditorStore((state) => state.previewMode)
  const isSelected = selectedNodeIds.includes(nodeId)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelect = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()

      if (isPreviewMode) {
        return
      }

      if (event.ctrlKey || event.metaKey) {
        toggleNodeSelection(nodeId)
      } else {
        setSelectedNodeIds([nodeId])
      }
    },
    [isPreviewMode, nodeId, setSelectedNodeIds, toggleNodeSelection],
  )

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      if (event.ctrlKey) {
        return
      }

      event.preventDefault()

      event.stopPropagation()

      if (isPreviewMode) {
        return
      }

      if (!selectedNodeIds.includes(nodeId)) {
        setSelectedNodeIds([nodeId])
      }

      setContextMenu({ x: event.clientX, y: event.clientY })
    },
    [isPreviewMode, nodeId, selectedNodeIds, setSelectedNodeIds],
  )

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()

      if (isPreviewMode) {
        return
      }

      setIsEditing(true)

      setEditValue(displayName)

      setTimeout(() => inputRef.current?.focus(), RENAME_FOCUS_DELAY_MS)
    },
    [displayName, isPreviewMode],
  )

  const handleLabelSave = useCallback(() => {
    setIsEditing(false)

    if (editValue.trim() && editValue.trim() !== displayName) {
      updateNodeLabel(nodeId, editValue.trim())
    }
  }, [editValue, displayName, nodeId, updateNodeLabel])

  const handleLabelKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleLabelSave()
      }

      if (event.key === 'Escape') {
        setIsEditing(false)

        setEditValue(displayName)
      }
    },
    [handleLabelSave, displayName],
  )

  const handleToggleExpand = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()

    setIsExpanded((prev) => !prev)
  }, [])

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  return {
    isSelected,
    isPreviewMode,
    isExpanded,
    isEditing,
    editValue,
    setEditValue,
    contextMenu,
    inputRef,
    handleSelect,
    handleContextMenu,
    handleDoubleClick,
    handleLabelSave,
    handleLabelKeyDown,
    handleToggleExpand,
    handleCloseContextMenu,
  }
}
