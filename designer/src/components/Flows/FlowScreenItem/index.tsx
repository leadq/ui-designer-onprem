import { useState } from 'react'
import { Box, Button, Group, Input, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { scrollToFrame } from '@root/utils/canvas/navigation'

import { FlowScreenOptions } from './FlowScreenOptions'

import styles from './styles.module.scss'

export interface FlowScreenItemProps {
  node: DesignNode
  flowId: string
  isStart: boolean
  isOverlay: boolean
}

export const FlowScreenItem = ({ node, flowId, isStart, isOverlay }: FlowScreenItemProps) => {
  const { translate } = useBuilderI18n()
  const editScreen = useEditorStore((state) => state.editFlowScreen)
  const updateLabel = useEditorStore((state) => state.updateNodeLabel)
  const setStart = useEditorStore((state) => state.setFlowStart)
  const removeNode = useEditorStore((state) => state.removeNode)
  const activeId = useEditorStore((state) => state.editingFlowScreenId)
  const isPreview = useEditorStore((state) => state.previewMode)
  const [isRenaming, setIsRenaming] = useState(false)
  const [draft, setDraft] = useState('')
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const handleSave = () => {
    if (draft.trim() && draft.trim() !== node.label) {
      updateLabel(node.id, draft.trim())
    }

    setIsRenaming(false)
  }

  const handleSelect = () => {
    editScreen(node.id)

    scrollToFrame(node.id)
  }

  const handleMakeStart = () => {
    setStart(flowId, node.id)

    setIsOptionsOpen(false)
  }

  const handleDelete = () => removeNode(node.id)
  const handleConfirmDeleteChange = setIsConfirmingDelete
  const handleSelectClick = handleSelect
  const handleSaveClick = handleSave

  return (
    <Box
      className={styles.flowScreenItem}
      data-active={activeId === node.id}
      data-screen-row={node.id}
    >
      <Box className={styles.flowScreenItem__row}>
        <Button
          aria-pressed={activeId === node.id}
          className={styles.flowScreenItem__select}
          isDisabled={isPreview}
          variant='ghost'
          onClick={handleSelectClick}
        >
          {isOverlay ? (
            <EditorIcon aria-hidden name='window' size={18} />
          ) : (
            <EditorIcon aria-hidden name='screen' size={18} />
          )}
          <Box className={styles.flowScreenItem__text}>
            <Text weight={500}>{node.label ?? translate('flow.screen')}</Text>
            <Text color='muted' size='xs'>
              {isStart
                ? translate('flow.firstScreen')
                : isOverlay
                  ? translate('flow.overlay')
                  : translate('flow.screen')}
            </Text>
          </Box>
        </Button>
        <Button
          aria-label={`${translate('flow.rename')}: ${node.label}`}
          className={styles.flowScreenItem__icon}
          isDisabled={isPreview}
          size='sm'
          variant='ghost'
          onClick={() => {
            setDraft(node.label ?? '')

            setIsRenaming(true)

            setIsOptionsOpen(false)
          }}
        >
          <EditorIcon aria-hidden name='edit' size={15} />
        </Button>
        <Button
          aria-expanded={isOptionsOpen}
          aria-label={`${translate('flow.screenOptions')}: ${node.label}`}
          className={styles.flowScreenItem__icon}
          isDisabled={isPreview}
          size='sm'
          variant='ghost'
          onClick={() => {
            setIsOptionsOpen(!isOptionsOpen)

            setIsConfirmingDelete(false)
          }}
        >
          <EditorIcon aria-hidden name='more' size={16} />
        </Button>
      </Box>
      {isRenaming ? (
        <Box className={styles.flowScreenItem__settings}>
          <Input
            autoFocus
            isDisabled={isPreview}
            label={translate('flow.frameName')}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSave()
              }

              if (event.key === 'Escape') {
                event.stopPropagation()

                setIsRenaming(false)
              }
            }}
          />
          <Group gap='xs'>
            <Button isDisabled={isPreview || !draft.trim()} size='sm' onClick={handleSaveClick}>
              {translate('flow.done')}
            </Button>
            <Button size='sm' variant='ghost' onClick={() => setIsRenaming(false)}>
              {translate('flow.cancel')}
            </Button>
          </Group>
        </Box>
      ) : null}
      {isOptionsOpen ? (
        <FlowScreenOptions
          isConfirmingDelete={isConfirmingDelete}
          isOverlay={isOverlay}
          isPreview={isPreview}
          isStart={isStart}
          onConfirmDeleteChange={handleConfirmDeleteChange}
          onDelete={handleDelete}
          onMakeStart={handleMakeStart}
        />
      ) : null}
    </Box>
  )
}
