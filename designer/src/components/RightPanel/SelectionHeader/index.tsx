import { Box, Button, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useActionEditorStore } from '@root/stores/actionEditorStore'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getCollectionItemLabel } from '@root/utils/collectionAuthoring/getCollectionItemLabel'

import styles from './styles.module.scss'

export interface SelectionHeaderProps {
  nodes: DesignNode[]
  title: string
}

export const SelectionHeader = ({ nodes, title }: SelectionHeaderProps) => {
  const { translate } = useBuilderI18n()
  const node = nodes.length === 1 ? nodes[0] : null
  const name = node?.label || (node ? getCollectionItemLabel(node, registry) : undefined) || title
  const isStructuralItem = nodes.some((item) => Boolean(registry[item.type]?.collectionItem))
  const hasNote = Boolean(node?.notes?.trim() || node?.annotations?.length)
  const handleSave = () => useEditorStore.getState().requestSaveDesign(nodes.map((item) => item.id))
  const handleSaveClick = handleSave

  return (
    <Box className={styles.selectionHeader}>
      <Box className={styles.selectionHeader__identity}>
        <Box className={styles.selectionHeader__name}>
          <Text weight={600}>{name}</Text>
          {name !== title && (
            <Text color='muted' size='xs'>
              {title}
            </Text>
          )}
        </Box>
        <Tooltip
          label={translate(
            isStructuralItem ? 'collectionAuthoring.saveGroupHint' : 'savedDesign.saveAction',
          )}
        >
          <Button
            aria-label={translate('savedDesign.saveAction')}
            className={styles.selectionHeader__save}
            isDisabled={isStructuralItem}
            size='sm'
            variant='ghost'
            onClick={handleSaveClick}
          >
            <EditorIcon aria-hidden name='save' size={18} />
          </Button>
        </Tooltip>
      </Box>
      {node ? (
        <Box className={styles.selectionHeader__actions}>
          <Button
            data-has-note={hasNote}
            size='sm'
            variant='ghost'
            onClick={(event) => {
              event.currentTarget.focus({ preventScroll: true })

              useActionEditorStore.getState().openNote(node.id)
            }}
          >
            <EditorIcon aria-hidden name='note' size={16} />
            {translate(hasNote ? 'context.noteEdit' : 'context.noteAdd')}
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={(event) => {
              event.currentTarget.focus({ preventScroll: true })

              useActionEditorStore.getState().open(node.id)
            }}
          >
            <EditorIcon aria-hidden name='arrowRight' size={16} />
            {translate('rightPanel.interactions')}
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}
