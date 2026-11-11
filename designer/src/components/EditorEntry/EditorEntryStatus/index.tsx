import { RejectedDesignNotice } from '@root/components/Editor/RejectedDesignNotice'
import { BuilderI18nProvider } from '@root/contexts/BuilderI18nContext'

import { EntryMessage } from './EntryMessage'

interface EditorEntryStatusProps {
  status: 'checking' | 'blocked' | 'unavailable' | 'storageError'
}

export const EditorEntryStatus = ({ status }: EditorEntryStatusProps) => (
  <BuilderI18nProvider>
    <EntryMessage status={status} />
    {status === 'storageError' && <RejectedDesignNotice />}
  </BuilderI18nProvider>
)
