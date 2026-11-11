import { useState } from 'react'
import { Box, Button, Disclosure, Group, Input, Stack, Text } from '@root/components/common'
import { NoteEditorModal } from '@root/components/Modals/NoteEditorModal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getAllNodes } from '@root/utils/flows/flowModel'

import { FlowConnections } from '../FlowConnections'
import { FlowScreenItem } from '../FlowScreenItem'

import styles from './styles.module.scss'

export interface FlowCardProps {
  node: DesignNode
}

export const FlowCard = ({ node }: FlowCardProps) => {
  const { translate } = useBuilderI18n()
  const [notesOpened, setNotesOpened] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const updateLabel = useEditorStore((state) => state.updateNodeLabel)
  const removeNode = useEditorStore((state) => state.removeNode)
  const previewMode = useEditorStore((state) => state.previewMode)
  const nodes = useEditorStore((state) => state.nodes)

  if (!node.flow) {
    return null
  }

  const flow = node.flow
  const all = getAllNodes(nodes)

  const screens = flow.screens.flatMap((screen) => {
    const child = all.find((item) => item.id === screen.nodeId)

    return child ? [{ child, kind: screen.kind }] : []
  })

  return (
    <Box className={styles.flowCard} data-flow-card={node.id}>
      <Stack gap='md'>
        {all.filter((item) => item.flow).length > 1 && (
          <Text color='muted' size='xs'>
            {node.label}
          </Text>
        )}
        <Stack gap='xs'>
          {screens.map(({ child, kind }) => (
            <FlowScreenItem
              key={child.id}
              flowId={node.id}
              isOverlay={kind === 'overlay'}
              isStart={flow.startScreenId === child.id}
              node={child}
            />
          ))}
        </Stack>
        <FlowConnections
          allNodes={all}
          nodes={getAllNodes(screens.map((screen) => screen.child))}
        />
        <Disclosure label={translate('flow.moreOptions')}>
          <Stack gap='sm'>
            <Input
              isDisabled={previewMode}
              label={translate('flow.name')}
              value={node.label ?? ''}
              onChange={(event) => updateLabel(node.id, event.target.value)}
            />
            <Button
              isDisabled={previewMode}
              size='sm'
              variant='ghost'
              onClick={() => setNotesOpened(true)}
            >
              {translate('flow.notes')}
            </Button>
            {isConfirmingDelete ? (
              <>
                <Text size='xs'>{translate('flow.deleteGroupHint')}</Text>
                <Group gap='xs'>
                  <Button
                    isDisabled={previewMode}
                    size='sm'
                    variant='danger'
                    onClick={() => removeNode(node.id)}
                  >
                    {translate('flow.delete')}
                  </Button>
                  <Button size='sm' variant='ghost' onClick={() => setIsConfirmingDelete(false)}>
                    {translate('flow.cancel')}
                  </Button>
                </Group>
              </>
            ) : (
              <Button
                isDisabled={previewMode}
                size='sm'
                variant='ghost'
                onClick={() => setIsConfirmingDelete(true)}
              >
                {translate('flow.delete')}
              </Button>
            )}
          </Stack>
        </Disclosure>
      </Stack>
      <NoteEditorModal
        isOpen={notesOpened}
        targetNodeId={node.id}
        onClose={() => setNotesOpened(false)}
      />
    </Box>
  )
}
