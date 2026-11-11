import { useDraggable } from '@dnd-kit/core'
import { Box, Button, Text, Tooltip } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { SlotComponent } from '@root/types/document'
import { findNode } from '@root/utils/nodes'

import styles from './styles.module.scss'

export interface SavedDesignItemProps {
  design: SlotComponent
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const SavedDesignItem = ({ design, onEdit, onDelete }: SavedDesignItemProps) => {
  const { translate } = useBuilderI18n()
  const previewMode = useEditorStore((state) => state.previewMode)
  const selectedNodeIds = useEditorStore((state) => state.selectedNodeIds)
  const insertSavedDesign = useEditorStore((state) => state.insertSavedDesign)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `saved-design-${design.id}`,
    disabled: previewMode,
    data: { savedDesignId: design.id, isPaletteItem: true, displayName: design.name },
  })

  const handleInsert = () => {
    if (previewMode || isDragging) {
      return
    }

    const selectedId = selectedNodeIds.length === 1 ? selectedNodeIds[0] : undefined
    const selectedNode = selectedId ? findNode(useEditorStore.getState().nodes, selectedId) : null

    if (selectedNode && registry[selectedNode.type]?.isContainer) {
      insertSavedDesign(design.id, selectedNode.id, 'inside')
    } else if (selectedNode) {
      insertSavedDesign(design.id, selectedNode.id, 'after')
    } else {
      insertSavedDesign(design.id)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()

    handleInsert()
  }

  const handleInsertClick = handleInsert

  return (
    <Box
      className={[
        styles.savedDesignItem,
        isDragging ? styles['savedDesignItem--dragging'] : '',
      ].join(' ')}
    >
      <Box
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        aria-label={translate('savedDesign.addNamed', { name: design.name })}
        className={styles.savedDesignItem__insert}
        onClick={handleInsertClick}
        onKeyDown={handleKeyDown}
      >
        <EditorIcon aria-hidden name='drag' size={16} />
        <Text className={styles.savedDesignItem__name} weight={500}>
          {design.name}
        </Text>
      </Box>
      <Box className={styles.savedDesignItem__actions}>
        <Tooltip label={translate('savedDesign.editNamed', { name: design.name })}>
          <Button
            aria-label={translate('savedDesign.editNamed', { name: design.name })}
            className={styles.savedDesignItem__action}
            isDisabled={previewMode}
            size='sm'
            type='button'
            variant='ghost'
            onClick={() => onEdit(design.id)}
          >
            <EditorIcon aria-hidden name='edit' size={16} />
          </Button>
        </Tooltip>
        <Tooltip label={translate('savedDesign.deleteNamed', { name: design.name })}>
          <Button
            aria-label={translate('savedDesign.deleteNamed', { name: design.name })}
            className={styles.savedDesignItem__action}
            isDisabled={previewMode}
            size='sm'
            type='button'
            variant='ghost'
            onClick={() => onDelete(design.id)}
          >
            <EditorIcon aria-hidden name='delete' size={16} />
          </Button>
        </Tooltip>
      </Box>
    </Box>
  )
}
