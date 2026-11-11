import { useEffect, useState } from 'react'
import { bootstrapWorkspace } from '@root/utils/workspacePersistence/bootstrapWorkspace'

export const useWorkspaceInitialization = (isOwner: boolean) => {
  const [status, setStatus] = useState<'checking' | 'ready' | 'storageError'>('checking')

  useEffect(() => {
    if (!isOwner) {
      return
    }

    let isActive = true

    bootstrapWorkspace()
      .then(() => {
        if (isActive) {
          setStatus('ready')
        }
      })
      .catch(() => {
        if (isActive) {
          setStatus('storageError')
        }
      })

    return () => {
      isActive = false
    }
  }, [isOwner])

  return status
}
