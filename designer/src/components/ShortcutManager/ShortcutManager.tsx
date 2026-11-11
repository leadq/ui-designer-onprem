import { useEffect } from 'react'
import { useEditorStore } from '@root/stores/editor'
import { getFrameIds } from '@root/utils/frames/frameWorkspace'
import { findParent } from '@root/utils/nodes'
import { getWorkspace } from '@root/utils/workspacePersistence/getWorkspace'
import { saveCurrentDesign } from '@root/utils/workspacePersistence/saveCurrentDesign'

export const ShortcutManager = () => {
  const selectedNodeIds = useEditorStore((state) => state.selectedNodeIds)
  const copyNode = useEditorStore((state) => state.copyNode)
  const pasteNode = useEditorStore((state) => state.pasteNode)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)
  const removeNode = useEditorStore((state) => state.removeNode)
  const removeSelectedNodes = useEditorStore((state) => state.removeSelectedNodes)
  const setSelectedNodeIds = useEditorStore((state) => state.setSelectedNodeIds)
  const clearSelection = useEditorStore((state) => state.clearSelection)
  const duplicateNode = useEditorStore((state) => state.duplicateNode)
  const duplicateSelectedNodes = useEditorStore((state) => state.duplicateSelectedNodes)
  const moveNodeOrdering = useEditorStore((state) => state.moveNodeOrdering)
  const focusedContainerId = useEditorStore((state) => state.focusedContainerId)
  const setFocusedContainer = useEditorStore((state) => state.setFocusedContainer)
  const nodes = useEditorStore((state) => state.nodes)
  const previewMode = useEditorStore((state) => state.previewMode)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }

      const isModalOpen = document.querySelector('[role="dialog"][aria-modal="true"]') !== null
      const isMenuOpen = document.querySelector('[role="menu"]') !== null

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()

        if (!isModalOpen && !previewMode && !getWorkspace().isSwitching) {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }

          void saveCurrentDesign().catch(() => {})
        }

        return
      }

      if (isModalOpen || isMenuOpen || previewMode) {
        return
      }

      const isMod = event.ctrlKey || event.metaKey

      // Duplicate: Ctrl+D (Allowed even when an input is focused, e.g. TextInput node)
      if (isMod && event.key.toLowerCase() === 'd') {
        event.preventDefault()

        if (selectedNodeIds.length > 1) {
          duplicateSelectedNodes()
        } else if (selectedNodeIds.length === 1) {
          duplicateNode(selectedNodeIds[0])
        }

        return
      }

      // Move Up/Down: Ctrl+ArrowUp / Ctrl+ArrowDown
      if (isMod && event.key === 'ArrowUp') {
        event.preventDefault()

        if (selectedNodeIds.length === 1) {
          moveNodeOrdering(selectedNodeIds[0], 'up')
        }

        return
      }

      if (isMod && event.key === 'ArrowDown') {
        event.preventDefault()

        if (selectedNodeIds.length === 1) {
          moveNodeOrdering(selectedNodeIds[0], 'down')
        }

        return
      }

      // Check if user is typing in an input/textarea
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)

      if (isInputFocused) {
        return
      }

      // Copy: Ctrl+C
      if (isMod && event.key.toLowerCase() === 'c') {
        if (selectedNodeIds.length === 1) {
          copyNode(selectedNodeIds[0])
        }
      }

      // Paste: Ctrl+V
      if (isMod && event.key.toLowerCase() === 'v') {
        if (selectedNodeIds.length <= 1) {
          pasteNode()
        }
      }

      // Delete: Delete or Ctrl/Cmd+Backspace
      const isDeleteShortcut = event.key === 'Delete' || (isMod && event.key === 'Backspace')

      if (isDeleteShortcut) {
        if (selectedNodeIds.length > 1) {
          event.preventDefault()

          removeSelectedNodes()
        } else if (selectedNodeIds.length === 1) {
          event.preventDefault()

          removeNode(selectedNodeIds[0])
        }
      }

      // Deselect: Escape
      if (event.key === 'Escape') {
        if (focusedContainerId && !getFrameIds(nodes).has(focusedContainerId)) {
          const parent = findParent(nodes, focusedContainerId)

          setSelectedNodeIds([focusedContainerId])

          setFocusedContainer(parent ? parent.id : null)
        } else {
          clearSelection()
        }
      }

      // Undo/Redo: Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y
      if (isMod && event.key.toLowerCase() === 'z') {
        event.preventDefault()

        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
      }

      if (isMod && event.key.toLowerCase() === 'y') {
        event.preventDefault()

        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedNodeIds,
    copyNode,
    pasteNode,
    undo,
    redo,
    removeNode,
    removeSelectedNodes,
    clearSelection,
    duplicateNode,
    duplicateSelectedNodes,
    moveNodeOrdering,
    focusedContainerId,
    setFocusedContainer,
    nodes,
    setSelectedNodeIds,
    previewMode,
  ])

  return null
}
