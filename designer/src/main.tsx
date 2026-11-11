import { lazy, StrictMode, Suspense } from 'react'

import { EditorEntry } from './components/EditorEntry'
import { EditorEntryStatus } from './components/EditorEntry/EditorEntryStatus'

import './styles/globals.scss'

const isCaptureMode = window.location.hash.startsWith('#/render/')
const isPreviewPage = isCaptureMode || window.location.hash.startsWith('#/preview/')

const LazyPreviewPage = lazy(async () => {
  const { PreviewEntry } = await import('./pages/PreviewEntry')

  return { default: PreviewEntry }
})

const App = () => (
  <StrictMode>
    <Suspense fallback={<EditorEntryStatus status='checking' />}>
      {isPreviewPage ? <LazyPreviewPage /> : <EditorEntry />}
    </Suspense>
  </StrictMode>
)

export default App
