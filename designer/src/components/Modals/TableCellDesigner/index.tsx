import { Box, Button, Group, Modal, Text } from '@root/components/common'
import { SaveDesignModal } from '@root/components/Modals/SaveDesignModal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'

import { useCellWorkspace } from './hooks/useCellWorkspace'
import { CellDesignerCanvas } from './CellDesignerCanvas'
import { CellDesignerInspector } from './CellDesignerInspector'
import { CellDesignerPalette } from './CellDesignerPalette'

import styles from './styles.module.scss'

export interface TableCellDesignerProps {
  tableId: string
  cell: DesignNode
  onClose: () => void
}

export const TableCellDesigner = ({ tableId, cell, onClose }: TableCellDesignerProps) => {
  const { translate } = useBuilderI18n()
  const draft = useCellWorkspace(tableId, cell, onClose)

  return (
    <>
      <Modal
        isOpen={!draft.isSaving}
        isOutsideClickCloseEnabled={false}
        size='full'
        title={translate('cellDesigner.title')}
        onClose={onClose}
      >
        <Box
          className={styles.tableCellDesigner}
          onKeyDown={(event) => {
            if (event.key !== 'Escape' && event.key !== 'Tab') {
              event.stopPropagation()
            }
          }}
        >
          <Text color='secondary' size='sm'>
            {translate('cellDesigner.hint')}
          </Text>
          <Group gap='sm'>
            <Button
              isDisabled={!draft.canUndo}
              size='sm'
              variant='outline'
              onClick={draft.handleUndo}
            >
              {translate('cellDesigner.undo')}
            </Button>
            <Button
              isDisabled={!draft.canRedo}
              size='sm'
              variant='outline'
              onClick={draft.handleRedo}
            >
              {translate('cellDesigner.redo')}
            </Button>
            <Button
              isDisabled={!draft.canDelete}
              size='sm'
              variant='outline'
              onClick={draft.handleDelete}
            >
              {translate('cellDesigner.delete')}
            </Button>
          </Group>
          <Box className={styles.tableCellDesigner__body}>
            <CellDesignerPalette
              saved={draft.saved}
              onAdd={draft.handleAdd}
              onSaved={draft.handleSaved}
            />
            <CellDesignerCanvas draft={draft} />
            <CellDesignerInspector
              breakpoint={draft.session.breakpoint}
              node={draft.selected}
              onProps={draft.handleProps}
              onStyle={draft.handleStyle}
            />
          </Box>
          {draft.error ? (
            <Text color='secondary' role='alert'>
              {translate('cellDesigner.error')}
            </Text>
          ) : null}
          <Group gap='sm' justify='end'>
            <Button variant='ghost' onClick={onClose}>
              {translate('general.cancel')}
            </Button>
            <Button variant='outline' onClick={draft.handleSave}>
              {translate('cellDesigner.save')}
            </Button>
            <Button onClick={draft.handleFinish}>{translate('cellDesigner.finish')}</Button>
          </Group>
        </Box>
      </Modal>
      {draft.isSaving ? (
        <SaveDesignModal nodeIds={[]} sourceNodes={[draft.root]} onClose={draft.handleSaveClose} />
      ) : null}
    </>
  )
}
