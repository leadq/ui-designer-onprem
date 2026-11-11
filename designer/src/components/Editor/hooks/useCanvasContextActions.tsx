import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { ContextMenuGroup } from '@root/types/contextMenu'
import { getFrameIds } from '@root/utils/frames/frameWorkspace'
import { findNode, findParent } from '@root/utils/nodes'

import { getNodeContextActions } from '../utils/getNodeContextActions'

export const useCanvasContextActions = (
  nodeId: string | null,
  onAddNote?: (id: string | null) => void,
  hasMultiSelection = false,
): ContextMenuGroup[] => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const selectedIds = useEditorStore((state) => state.selectedNodeIds)
  const copiedNode = useEditorStore((state) => state.copiedNode)
  const width = useEditorStore((state) => state.canvasWidth)
  const canUndo = useEditorStore((state) => state.historyIndex > 0)
  const canRedo = useEditorStore((state) => state.historyIndex < state.history.length - 1)
  const node = nodeId ? findNode(nodes, nodeId) : null
  const parent = nodeId ? findParent(nodes, nodeId) : null
  const frames = getFrameIds(nodes)
  const isFrame = !!node && frames.has(node.id)
  const selection = nodeId && selectedIds.includes(nodeId) ? selectedIds : nodeId ? [nodeId] : []
  const store = useEditorStore.getState
  const modifier = navigator.platform.includes('Mac') ? '⌘' : 'Ctrl+'

  const { design, flow, structure, general } = getNodeContextActions({
    node,
    nodeId,
    parent,
    width,
    isFrame,
    hasMultiSelection,
    selection,
    frames,
    modifier,
    translate,
  })

  if (!nodeId) {
    general.push(
      {
        id: 'undo',
        label: translate('header.undo'),
        icon: <EditorIcon name='undo' size={16} />,
        shortcut: `${modifier}Z`,
        inline: true,
        disabled: !canUndo,
        onSelect: () => store().undo(),
      },
      {
        id: 'redo',
        label: translate('header.redo'),
        icon: <EditorIcon name='redo' size={16} />,
        shortcut: `${modifier}Shift+Z`,
        inline: true,
        disabled: !canRedo,
        onSelect: () => store().redo(),
      },
    )
  }

  if (onAddNote) {
    flow.push({
      id: 'note',
      label: translate(nodeId ? 'context.note' : 'context.pageBehavior'),
      icon: <EditorIcon name='note' size={16} />,
      onSelect: () => onAddNote(nodeId),
    })
  }

  general.push({
    id: 'paste',
    label: translate('context.paste'),
    icon: <EditorIcon name='paste' size={16} />,
    shortcut: `${modifier}V`,
    disabled: !copiedNode || hasMultiSelection,
    onSelect: () => {
      if (nodeId) {
        store().setSelectedNodeIds([nodeId])
      }

      store().pasteNode()
    },
  })

  if (node && nodeId) {
    if (!isFrame) {
      general.push({
        id: 'duplicate',
        label: hasMultiSelection
          ? translate('tree.duplicateMany', { count: selectedIds.length })
          : translate('context.duplicate'),
        icon: <EditorIcon name='duplicate' size={16} />,
        shortcut: `${modifier}D`,
        onSelect: () => {
          if (hasMultiSelection) {
            store().duplicateSelectedNodes()
          } else {
            store().duplicateNode(nodeId)
          }
        },
      })
    }

    general.push({
      id: 'delete',
      label: hasMultiSelection
        ? translate('tree.deleteMany', { count: selectedIds.length })
        : translate('context.delete'),
      icon: <EditorIcon name='delete' size={16} />,
      shortcut: 'Del',
      danger: true,
      onSelect: () => {
        if (hasMultiSelection) {
          store().removeSelectedNodes()
        } else {
          store().removeNode(nodeId)
        }
      },
    })
  }

  return [
    { id: 'design', label: translate('context.group.design'), items: design },
    { id: 'flow', label: translate('context.group.flow'), items: flow },
    { id: 'structure', label: translate('context.group.structure'), items: structure },
    { id: 'general', label: translate('context.group.general'), items: general },
  ]
}
