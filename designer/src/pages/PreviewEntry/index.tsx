import { readPreviewSnapshot, resetPreview } from '@root/utils/preview/previewSession'

import { PreviewPage } from '../PreviewPage'

const isCaptureMode = window.location.hash.startsWith('#/render/')

const snapshot = readPreviewSnapshot(
  window.location.hash.slice(isCaptureMode ? '#/render/'.length : '#/preview/'.length),
)

if (snapshot) {
  resetPreview(snapshot)
}

export const PreviewEntry = () => <PreviewPage isCaptureMode={isCaptureMode} snapshot={snapshot} />
