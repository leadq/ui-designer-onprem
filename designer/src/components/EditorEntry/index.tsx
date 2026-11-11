import { lazy, Suspense } from 'react'
import { useEditorOwnership } from '@root/hooks/useEditorOwnership'
import { useWorkspaceInitialization } from '@root/hooks/useWorkspaceInitialization'

import { EditorEntryStatus } from './EditorEntryStatus'

const LazyApp = lazy(async () => {
  const { App } = await import('../../App')

  return { default: App }
})

export const EditorEntry = () => {
  const ownership = useEditorOwnership()
  const workspaceStatus = useWorkspaceInitialization(ownership === 'active')

  if (ownership !== 'active') {
    return <EditorEntryStatus status={ownership} />
  }

  if (workspaceStatus !== 'ready') {
    return <EditorEntryStatus status={workspaceStatus} />
  }

  return (
    <Suspense fallback={<EditorEntryStatus status='checking' />}>
      <LazyApp />
    </Suspense>
  )
}
