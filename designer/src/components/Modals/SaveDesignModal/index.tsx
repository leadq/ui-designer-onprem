import { type FormEvent, useState } from 'react'
import { Box, Button, Group, Input, Modal, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { cloneNodesForReuse, getSelectedRootNodes } from '@root/utils/nodes'
import { v4 as uuidv4 } from 'uuid'

import styles from './styles.module.scss'

export interface SaveDesignModalProps {
  nodeIds: string[]
  sourceNodes?: DesignNode[]
  onClose: () => void
}

export const SaveDesignModal = ({ nodeIds, sourceNodes, onClose }: SaveDesignModalProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const createSlotComponent = useEditorStore((state) => state.createSlotComponent)
  const selectedRoots = sourceNodes ?? getSelectedRootNodes(nodes, nodeIds)

  const suggestedName =
    selectedRoots.length === 1
      ? (selectedRoots[0].label ?? registry[selectedRoots[0].type]?.displayName ?? '')
      : ''

  const [name, setName] = useState(suggestedName)

  const itemNames = selectedRoots.map(
    (node) => node.label ?? registry[node.type]?.displayName ?? node.type,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName || selectedRoots.length === 0) {
      return
    }

    createSlotComponent(uuidv4(), trimmedName, cloneNodesForReuse(selectedRoots))

    onClose()
  }

  return (
    <Modal isOpen size='sm' title={translate('savedDesign.saveTitle')} onClose={onClose}>
      <form className={styles.saveDesignModal} onSubmit={handleSubmit}>
        <Stack gap='md'>
          <Text color='secondary'>{translate('savedDesign.saveHint')}</Text>
          <Box className={styles.saveDesignModal__selection}>
            <Text color='muted' size='xs'>
              {translate('savedDesign.selection')}
            </Text>
            <Text weight={600}>{itemNames.join(', ')}</Text>
          </Box>
          <Input
            autoFocus
            label={translate('savedDesign.name')}
            maxLength={80}
            placeholder={translate('savedDesign.namePlaceholder')}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Text color='muted' size='xs'>
            {translate('savedDesign.copyHint')}
          </Text>
          <Group gap='sm' justify='end'>
            <Button type='button' variant='outline' onClick={onClose}>
              {translate('general.cancel')}
            </Button>
            <Button isDisabled={!name.trim() || selectedRoots.length === 0} type='submit'>
              {translate('savedDesign.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
