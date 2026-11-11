import type { DesignDocument } from '@root/utils/designDocument'

export interface PreviewSnapshot {
  document: DesignDocument
  flowId?: string
  createdAt: number
}
