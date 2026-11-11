import { Box, Button, Group, Modal, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { useNoteEditor } from '../hooks/useNoteEditor'

import { AnnotationDraftForm } from './AnnotationDraftForm'
import { AnnotationList } from './AnnotationList'

import styles from './styles.module.scss'

const ANNOTATION_PREVIEW_LENGTH = 64

export interface NoteEditorModalProps {
  isOpen: boolean
  onClose: () => void
  targetNodeId: string | null
}

export const NoteEditorModal = ({ isOpen, onClose, targetNodeId }: NoteEditorModalProps) => {
  const { translate } = useBuilderI18n()
  const editor = useNoteEditor(isOpen, targetNodeId)
  const { pendingDelete, selectedId, draft, success } = editor

  return (
    <Modal
      isOpen={isOpen}
      size={pendingDelete ? 'sm' : 'lg'}
      title={translate(pendingDelete ? 'annotation.deleteTitle' : 'annotation.editorTitle')}
      onClose={pendingDelete ? editor.handleCancelDelete : onClose}
    >
      {pendingDelete ? (
        <Stack className={styles.noteEditorModal} gap='md'>
          <Text>{translate('annotation.deleteMessage')}</Text>
          <Text weight={600}>
            {pendingDelete.title || pendingDelete.text.slice(0, ANNOTATION_PREVIEW_LENGTH)}
          </Text>
          <Group justify='end'>
            <Button variant='outline' onClick={editor.handleCancelDelete}>
              {translate('annotation.keep')}
            </Button>
            <Button variant='danger' onClick={editor.handleConfirmDelete}>
              {translate('annotation.confirmDelete')}
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack className={styles.noteEditorModal} gap='md'>
          <Box className={styles.noteEditorModal__target}>
            {translate('behavior.target')}: {editor.targetName}
          </Box>
          <Box className={styles.noteEditorModal__workspace}>
            <AnnotationList
              annotations={editor.annotations}
              selectedId={selectedId}
              onDelete={editor.handleRequestDelete}
              onNew={editor.handleNewClick}
              onSelect={editor.handleSelect}
            />
            <Stack className={styles.noteEditorModal__editor} gap='md'>
              <AnnotationDraftForm
                draft={draft}
                isPageAnnotation={editor.isPageAnnotation}
                onChange={editor.handleSetDraftChange}
              />
              <Box className={styles.noteEditorModal__footer}>
                <Text aria-live='polite' className={styles.noteEditorModal__success} role='status'>
                  {success ? translate(success.key) : ''}
                </Text>
                <Button isDisabled={!draft.text.trim()} onClick={editor.handleSaveClick}>
                  {translate(selectedId ? 'annotation.update' : 'annotation.add')}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      )}
    </Modal>
  )
}
