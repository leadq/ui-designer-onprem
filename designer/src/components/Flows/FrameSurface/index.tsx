import { type ReactNode, useState } from 'react'
import { DesignInteractionSurface } from '@root/components/Canvas/DesignInteractionSurface'
import { Box, Button, Input, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useActionEditorStore } from '@root/stores/actionEditorStore'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { handleDesignPointerDown } from '@root/utils/canvas/drag/handleDesignPointerDown'

import { FrameSelectionButton } from './FrameSelectionButton'

import styles from './styles.module.scss'

export interface FrameSurfaceProps {
  node: DesignNode
  isSelectionVisible?: boolean
  children: ReactNode
}

export const FrameSurface = ({ node, children, isSelectionVisible = true }: FrameSurfaceProps) => {
  const isFrameSelected = useEditorStore((state) => state.selectedFrameIds.includes(node.id))
  const { translate } = useBuilderI18n()
  const updateLabel = useEditorStore((state) => state.updateNodeLabel)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const noteText = [
    node.notes?.trim(),
    ...(node.annotations ?? []).map((note) => [note.title, note.text].filter(Boolean).join(': ')),
  ]
    .filter(Boolean)
    .join('\n\n')

  const noteActionLabel = translate(noteText ? 'context.noteEdit' : 'context.noteAdd')

  const handleSave = () => {
    const value = draft.trim()

    if (value && value !== node.label) {
      updateLabel(node.id, value)
    }

    setIsEditing(false)
  }

  const handleSaveBlur = handleSave

  return (
    <Box
      className={styles.frameSurface}
      data-frame-selected={isFrameSelected}
      data-frame-surface={node.id}
    >
      <Box className={styles.frameSurface__heading} data-frame-name={node.id}>
        {isEditing ? (
          <Input
            autoFocus
            aria-label={translate('flow.frameName')}
            className={styles.frameSurface__input}
            value={draft}
            onBlur={handleSaveBlur}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()

                handleSave()
              }

              if (event.key === 'Escape') {
                event.stopPropagation()

                setIsEditing(false)
              }
            }}
          />
        ) : (
          <EditorTooltip label={translate('flow.renameHint')}>
            <Button
              aria-label={`${translate('flow.rename')}: ${node.label}`}
              className={styles.frameSurface__name}
              size='sm'
              variant='ghost'
              onClick={() => {
                setDraft(node.label ?? '')

                setIsEditing(true)
              }}
            >
              <EditorIcon aria-hidden name='screen' size={15} />
              <Text className={styles.frameSurface__nameText}>{node.label}</Text>
              <EditorIcon aria-hidden name='edit' size={14} />
            </Button>
          </EditorTooltip>
        )}
        {isSelectionVisible ? (
          <FrameSelectionButton
            className={styles.frameSurface__note}
            frameId={node.id}
            label={node.label ?? translate('flow.screen')}
          />
        ) : null}
        <EditorTooltip
          label={
            <Text className={styles.frameSurface__noteText} color='inherit'>
              {noteText ? `${noteActionLabel}\n\n${noteText}` : noteActionLabel}
            </Text>
          }
        >
          <Button
            aria-label={`${noteActionLabel}: ${node.label}`}
            className={`${styles.frameSurface__note} ${noteText ? styles['frameSurface__note--filled'] : ''}`}
            data-frame-note={node.id}
            size='sm'
            variant='ghost'
            onClick={(event) => {
              event.currentTarget.focus({ preventScroll: true })

              useActionEditorStore.getState().openNote(node.id)
            }}
          >
            <EditorIcon aria-hidden name='note' size={16} />
          </Button>
        </EditorTooltip>
      </Box>
      <Box className={styles.frameSurface__body} onPointerDown={handleDesignPointerDown}>
        <DesignInteractionSurface>{children}</DesignInteractionSurface>
      </Box>
    </Box>
  )
}
