import type { ReferenceImage } from '@root/types/references'
import { getWorkspace } from '@root/utils/workspacePersistence/getWorkspace'

import { writeQueue } from './constants'
import { openDatabase } from './openDatabase'

const saveReference = async (image: ReferenceImage | string): Promise<void> => {
  // WebKit can reject Blob persistence even when IndexedDB is available. Store
  // binary bytes (never Base64); reconstruct a Blob only for rendering/transfer.
  const data = typeof image === 'string' ? undefined : await image.blob.arrayBuffer()
  const db = await openDatabase()

  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('images', 'readwrite')
      const store = tx.objectStore('images')

      if (typeof image === 'string') {
        store.delete(image)
      } else {
        const { blob: _blob, ...metadata } = image

        store.put({ ...metadata, data, sessionId: getWorkspace().clientId })
      }

      tx.oncomplete = () => resolve()

      const handleWriteError = () => reject(new Error('reference.storageError'))

      tx.onabort = handleWriteError

      tx.onerror = handleWriteError
    })
  } finally {
    db.close()
  }
}

export const writeReference = (image: ReferenceImage | string): Promise<void> => {
  const result = writeQueue.pendingWrite.then(() => saveReference(image))

  writeQueue.pendingWrite = result.catch(() => {})

  return result
}
