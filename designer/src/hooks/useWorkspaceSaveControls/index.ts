import { useState, useSyncExternalStore } from 'react'
import { getWorkspaceSaveStatus } from '@root/utils/workspacePersistence/getWorkspaceSaveStatus'
import { isAutoSaveEnabled as getIsAutoSaveEnabled } from '@root/utils/workspacePersistence/isAutoSaveEnabled'
import { setAutoSaveEnabled } from '@root/utils/workspacePersistence/setAutoSaveEnabled'
import { subscribeWorkspacePersistence } from '@root/utils/workspacePersistence/subscribeWorkspacePersistence'

export const useWorkspaceSaveControls = () => {
  const status = useSyncExternalStore(subscribeWorkspacePersistence, getWorkspaceSaveStatus)

  const isAutoSaveEnabled = useSyncExternalStore(
    subscribeWorkspacePersistence,
    getIsAutoSaveEnabled,
  )

  const [hasPreferenceError, setHasPreferenceError] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const handleAutoSaveChange = async (isEnabled: boolean) => {
    setIsBusy(true)

    setHasPreferenceError(false)

    try {
      await setAutoSaveEnabled(isEnabled)
    } catch {
      setHasPreferenceError(true)
    } finally {
      setIsBusy(false)
    }
  }

  return { status, isAutoSaveEnabled, hasPreferenceError, isBusy, handleAutoSaveChange }
}
