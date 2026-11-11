import { useEffect } from 'react'
import { Badge, Button, Group, Modal, ScrollArea, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useWorkspaceDesigns } from '@root/hooks/useWorkspaceDesigns'
import { useWorkspaceConfirmation } from '@root/stores/workspaceConfirmationStore'
import { getWorkspace } from '@root/utils/workspacePersistence/state'

import styles from './styles.module.scss'

export interface WorkspaceDesignsProps {
  isOpen: boolean
  onClose: () => void
}

export const WorkspaceDesigns = ({ isOpen, onClose }: WorkspaceDesignsProps) => {
  const hasConfirmation = useWorkspaceConfirmation((state) => Boolean(state.request))
  const { translate, language } = useBuilderI18n()

  const { designs, error, isBusy, handleMenuChange, handleSelectClick, handleNewClick } =
    useWorkspaceDesigns()

  useEffect(() => {
    if (isOpen) {
      handleMenuChange(true)
    }
  }, [isOpen, handleMenuChange])

  const isLibraryOpen = isOpen && !hasConfirmation

  return (
    <Modal isOpen={isLibraryOpen} title={translate('workspace.menu')} onClose={onClose}>
      <Stack className={styles.workspaceDesigns} gap='md'>
        <Text color='secondary' size='sm'>
          {translate('workspace.localHint')}
        </Text>
        <Button
          isDisabled={isBusy}
          onClick={async () => {
            if (await handleNewClick()) {
              onClose()
            }
          }}
        >
          {translate('workspace.new')}
        </Button>
        <ScrollArea className={styles.workspaceDesigns__list}>
          <Stack gap='sm'>
            {designs.map((design) => (
              <Group key={design.id} justify='between'>
                <Stack gap='xs'>
                  <Text>
                    {(design.document as { pageName?: string })?.pageName ??
                      translate('workspace.untitled')}
                  </Text>
                  <Text color='muted' size='xs'>
                    {new Date(design.updatedAt).toLocaleString(
                      language === 'tr' ? 'tr-TR' : 'en-US',
                    )}
                  </Text>
                </Stack>
                {design.id === getWorkspace().active.id ? (
                  <Badge>{translate('workspace.active')}</Badge>
                ) : (
                  <Button
                    isDisabled={isBusy}
                    size='sm'
                    onClick={async () => {
                      if (await handleSelectClick(design.id)) {
                        onClose()
                      }
                    }}
                  >
                    {translate('workspace.open')}
                  </Button>
                )}
              </Group>
            ))}
          </Stack>
        </ScrollArea>
        {error ? <Text role='alert'>{error}</Text> : null}
      </Stack>
    </Modal>
  )
}
