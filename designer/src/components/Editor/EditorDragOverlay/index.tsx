import { createPortal } from 'react-dom'
import { defaultDropAnimationSideEffects, DragOverlay, type Modifier } from '@dnd-kit/core'
import { Box, Text } from '@root/components/common'
import type { DesignNode } from '@root/types/document'

import type { ActiveItem, DragActiveData } from '../hooks/useEditorDrag'

export interface EditorDragOverlayProps {
  activeItem: ActiveItem | null
  centerOverlayOnCursor: Modifier
  isPalette: boolean
  paletteWidth?: number
}

export const EditorDragOverlay = ({
  activeItem,
  centerOverlayOnCursor,
  isPalette,
  paletteWidth,
}: EditorDragOverlayProps) => {
  const isExistingNode = (item: ActiveItem): item is DesignNode =>
    'id' in item && 'props' in item && 'children' in item

  return createPortal(
    <DragOverlay
      modifiers={[centerOverlayOnCursor]}
      style={{ pointerEvents: 'none' }}
      dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}
    >
      {activeItem ? (
        <Box
          data-designer-drag-overlay
          style={{
            opacity: 0.8,
            cursor: 'grabbing',
            pointerEvents: 'none',
            width: isPalette && paletteWidth !== undefined ? `${paletteWidth}px` : '220px',
            padding: isPalette ? '0' : '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            boxSizing: 'border-box',
          }}
        >
          <Text size='sm' style={{ color: 'inherit' }} weight={500}>
            {isExistingNode(activeItem)
              ? activeItem.type.charAt(0).toUpperCase() + activeItem.type.slice(1)
              : (activeItem as DragActiveData).displayName || activeItem.type || ''}
          </Text>
        </Box>
      ) : null}
    </DragOverlay>,
    document.body,
  )
}
