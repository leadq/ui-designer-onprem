import { Button, Group, Modal, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import {
  resolveWorkspaceChange,
  useWorkspaceConfirmation,
} from '@root/stores/workspaceConfirmationStore'

export const WorkspaceConfirmation = () => {
  const request = useWorkspaceConfirmation((state) => state.request)
  const { translate } = useBuilderI18n()

  return (
    <Modal
      isOpen={Boolean(request)}
      title={translate('workspace.replaceTitle')}
      onClose={() => resolveWorkspaceChange('cancel')}
    >
      <Stack gap='md'>
        <Text>{translate('workspace.replaceHint')}</Text>
        {request?.isDirty ? <Text>{translate('workspace.unsavedWarning')}</Text> : null}
        <Group gap='sm' justify='end'>
          <Button variant='secondary' onClick={() => resolveWorkspaceChange('cancel')}>
            {translate('general.cancel')}
          </Button>
          <Button variant='secondary' onClick={() => resolveWorkspaceChange('discard')}>
            {translate(request?.isDirty ? 'workspace.discardContinue' : 'workspace.continue')}
          </Button>
          {request?.isDirty ? (
            <Button onClick={() => resolveWorkspaceChange('save')}>
              {translate('workspace.saveContinue')}
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Modal>
  )
}
