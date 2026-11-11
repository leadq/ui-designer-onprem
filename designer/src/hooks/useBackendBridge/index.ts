import { useEffect } from 'react'
import { setMcpConnectionStatus } from '@root/stores/mcpConnectionStore'
import { startBackendBridge } from '@root/utils/backendBridge/startBackendBridge'
import { getWorkspace } from '@root/utils/workspacePersistence/getWorkspace'
import { getWorkspaceSaveStatus } from '@root/utils/workspacePersistence/getWorkspaceSaveStatus'
import { flushWorkspace } from '@root/utils/workspacePersistence/persistence'

export const useBackendBridge = () => {
  useEffect(() => {
    const stop = startBackendBridge(setMcpConnectionStatus)

    const handleFlush = () => {
      if (getWorkspace().isAutoSaveEnabled && !getWorkspace().isSwitching) {
        void flushWorkspace().catch(() => {})
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (getWorkspaceSaveStatus() !== 'saved') {
        event.preventDefault()

        event.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    window.addEventListener('pagehide', handleFlush)

    document.addEventListener('visibilitychange', handleFlush)

    return () => {
      stop()

      window.removeEventListener('beforeunload', handleBeforeUnload)

      window.removeEventListener('pagehide', handleFlush)

      document.removeEventListener('visibilitychange', handleFlush)
    }
  }, [])
}
