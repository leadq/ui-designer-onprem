import { ContextMenu, type ContextMenuPosition } from '@root/components/common/ContextMenu'
import { useCanvasContextActions } from '@root/components/Editor/hooks/useCanvasContextActions'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

export interface CanvasContextMenuProps {
  position: ContextMenuPosition | null
  targetNodeId: string | null
  onClose: () => void
  onAddNote: (nodeId: string | null) => void
}

export const CanvasContextMenu = ({
  position,
  targetNodeId,
  onClose,
  onAddNote,
}: CanvasContextMenuProps) => {
  const { translate } = useBuilderI18n()
  const groups = useCanvasContextActions(targetNodeId, onAddNote)

  if (!position) {
    return null
  }

  return (
    <ContextMenu
      groups={groups}
      label={translate(targetNodeId ? 'context.component' : 'context.page')}
      position={position}
      onClose={onClose}
    />
  )
}

export type { ContextMenuPosition }
