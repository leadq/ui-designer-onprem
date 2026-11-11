import type { ReferenceImage } from '@root/types/references'

export interface StoredReference extends Omit<ReferenceImage, 'blob'> {
  sessionId: string
  data?: ArrayBuffer
  blob?: Blob
}
