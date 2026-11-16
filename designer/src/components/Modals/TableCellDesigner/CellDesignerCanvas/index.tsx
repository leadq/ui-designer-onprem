import { getAdapter } from '@root/adapters'
import { Box } from '@root/components/common'
import { IconEditingProvider } from '@root/contexts/IconEditingContext'

import { CellDesignerTree } from '../CellDesignerTree'
import { CellDraftNode } from '../CellDraftNode'
import type { useCellWorkspace } from '../hooks/useCellWorkspace'

import styles from '../styles.module.scss'

export interface CellDesignerCanvasProps {
  draft: ReturnType<typeof useCellWorkspace>
}

export const CellDesignerCanvas = ({ draft }: CellDesignerCanvasProps) => {
  const Provider = getAdapter(draft.session.adapterId).Provider

  return (
    <Box data-editor-viewport className={styles.tableCellDesigner__center}>
      <Box
        data-cell-canvas
        data-designer-library
        className={[
          styles.tableCellDesigner__canvas,
          draft.isOver ? styles['tableCellDesigner__canvas--over'] : '',
        ].join(' ')}
        onClickCapture={draft.handleCanvasSelect}
        onDragLeave={draft.handleDragLeave}
        onDragOver={draft.handleDragOver}
        onDragStart={draft.handleDragStart}
        onDrop={draft.handleDrop}
        onDoubleClickCapture={(event) => {
          const iconId = (event.target as Element).closest<HTMLElement>('[data-icon-editor]')
            ?.dataset.iconEditor

          if (iconId) {
            draft.handleSelect(iconId)
          } else {
            draft.handleCanvasSelect(event)
          }
        }}
        onFocusCapture={(event) =>
          event.target instanceof HTMLElement &&
          !event.target.closest('[data-canvas-control]') &&
          event.target.blur()
        }
      >
        <Provider>
          <IconEditingProvider
            selectedIds={[draft.selected.id]}
            onChange={(_id, value) => draft.handleProps('glyph', value)}
          >
            <CellDraftNode
              node={draft.root}
              selectedId={draft.selected.id}
              width={draft.session.width}
            />
          </IconEditingProvider>
        </Provider>
      </Box>
      <Box className={styles.tableCellDesigner__tree}>
        <CellDesignerTree
          node={draft.root}
          selectedId={draft.selected.id}
          onSelect={draft.handleSelect}
        />
      </Box>
    </Box>
  )
}
