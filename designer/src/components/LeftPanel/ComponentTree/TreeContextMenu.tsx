import { ContextMenu } from '@root/components/common/ContextMenu'
import { useCanvasContextActions } from '@root/components/Editor/hooks/useCanvasContextActions'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'

export interface TreeContextMenuProps {
  nodeId: string
  x: number
  y: number
  onClose: () => void
}

export const TreeContextMenu = ({ nodeId, x, y, onClose }: TreeContextMenuProps) => {
  const { translate } = useBuilderI18n()
  const selectedIds = useEditorStore((state) => state.selectedNodeIds)

  const groups = useCanvasContextActions(
    nodeId,
    undefined,
    selectedIds.includes(nodeId) && selectedIds.length > 1,
  )

  return (
    <ContextMenu
      groups={groups}
      label={translate('context.component')}
      position={{ x, y }}
      onClose={onClose}
    />
  )
}
