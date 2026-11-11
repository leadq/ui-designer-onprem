import { useState } from 'react'
import { Box, Button, Stack, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { NoteEditorModal } from '@root/components/Modals/NoteEditorModal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'

import styles from './styles.module.scss'

export interface FrameInspectorProps {
  node?: DesignNode
}

export const FrameInspector = ({ node }: FrameInspectorProps) => {
  const { translate } = useBuilderI18n()
  const [isNotesOpen, setIsNotesOpen] = useState(false)

  return (
    <Box className={styles.frameInspector}>
      <Stack gap='sm'>
        <EditorIcon aria-hidden name='screen' size={22} />
        <Text weight={600}>{translate('flow.screen')}</Text>
        <Text color='muted' size='sm'>
          {translate('frame.contextHint')}
        </Text>
        {node ? (
          <>
            <Text weight={500}>{node.label}</Text>
            <Button variant='ghost' onClick={() => setIsNotesOpen(true)}>
              {translate('frame.notes')}
            </Button>
            <NoteEditorModal
              isOpen={isNotesOpen}
              targetNodeId={node.id}
              onClose={() => setIsNotesOpen(false)}
            />
          </>
        ) : null}
      </Stack>
    </Box>
  )
}
