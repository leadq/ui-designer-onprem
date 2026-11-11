import { useState } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { getWorkspace } from '@root/utils/workspacePersistence/state'

export const useMcpConnectionCopy = () => {
  const { translate } = useBuilderI18n()
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState('')

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(getWorkspace().clientId)

      setIsCopied(true)

      setError('')
    } catch {
      setError(translate('workspace.copyFailed'))
    }
  }

  return { isCopied, error, handleCopyClick }
}
