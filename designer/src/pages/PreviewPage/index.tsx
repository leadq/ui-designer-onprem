import { PrototypePreview } from '@root/components/PrototypePreview'
import { BuilderI18nProvider } from '@root/contexts/BuilderI18nContext'
import type { PreviewSnapshot } from '@root/utils/preview/previewSession'

export interface PreviewPageProps {
  snapshot: PreviewSnapshot | null
  isCaptureMode?: boolean
}

export const PreviewPage = ({ snapshot, isCaptureMode = false }: PreviewPageProps) => (
  <BuilderI18nProvider>
    <PrototypePreview isCaptureMode={isCaptureMode} snapshot={snapshot} />
  </BuilderI18nProvider>
)
