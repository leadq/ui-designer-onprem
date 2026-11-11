import { useSyncExternalStore } from 'react'
import { Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { getWorkspaceSaveStatus } from '@root/utils/workspacePersistence/getWorkspaceSaveStatus'
import { subscribeWorkspacePersistence } from '@root/utils/workspacePersistence/subscribeWorkspacePersistence'

export const WorkspaceSaveStatus = () => {
  const { translate } = useBuilderI18n()
  const status = useSyncExternalStore(subscribeWorkspacePersistence, getWorkspaceSaveStatus)

  const message =
    status === 'error'
      ? 'workspace.saveFailed'
      : status === 'saving'
        ? 'workspace.savingState'
        : status === 'unsaved'
          ? 'workspace.unsavedState'
          : 'workspace.savedState'

  return (
    <Text aria-live='polite' color='muted' role={status === 'error' ? 'alert' : 'status'} size='xs'>
      {translate(message)}
    </Text>
  )
}
