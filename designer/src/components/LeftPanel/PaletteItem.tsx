import { useDraggable } from '@dnd-kit/core'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { findNode } from '@root/utils/nodes'

import { Box, Text } from '../common'
import { Tooltip } from '../common/Tooltip'

import { PalettePreview } from './PalettePreview'

import styles from './PaletteItem.module.scss'

interface PaletteItemProps {
  type: string
  displayName: string
}

export const PaletteItem = ({ type, displayName }: PaletteItemProps) => {
  const { translate } = useBuilderI18n()
  const adapterId = useEditorStore((state) => state.adapterId)
  const isPreviewMode = useEditorStore((state) => state.previewMode)
  const selectedNodeIds = useEditorStore((state) => state.selectedNodeIds)
  const addNode = useEditorStore((state) => state.addNode)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    disabled: isPreviewMode,
    data: {
      type,
      isPaletteItem: true,
      displayName,
    },
  })

  const handleInsert = () => {
    if (isPreviewMode || isDragging) {
      return
    }

    const selectedId = selectedNodeIds.length === 1 ? selectedNodeIds[0] : undefined
    const selectedNode = selectedId ? findNode(useEditorStore.getState().nodes, selectedId) : null

    if (selectedNode && registry[selectedNode.type]?.isContainer) {
      addNode(type, selectedNode.id, 'inside')
    } else if (selectedNode) {
      addNode(type, selectedNode.id, 'after')
    } else {
      addNode(type)
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
    <Tooltip
      accessibleLabel={displayName}
      delay={500}
      isDisabled={isDragging || isPreviewMode}
      position='right'
      variant='preview'
      label={
        <PalettePreview
          key={adapterId + type}
          adapterId={adapterId}
          displayName={displayName}
          type={type}
        />
      }
    >
      <Box
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        aria-label={translate('componentSearch.addNamed', { name: displayName })}
        className={[styles.paletteItem, isDragging ? styles['paletteItem--dragging'] : ''].join(
          ' ',
        )}
        onClick={handleInsertClick}
        onKeyDown={handleKeyDown}
      >
        <Text className={styles.paletteItem__label}>{displayName}</Text>
      </Box>
    </Tooltip>
  )
}
