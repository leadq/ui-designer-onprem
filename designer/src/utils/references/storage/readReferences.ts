import type { ReferenceImage } from '@root/types/references'
import { getWorkspace } from '@root/utils/workspacePersistence/getWorkspace'

import { openDatabase } from './openDatabase'
import type { StoredReference } from './types'

export const readReferences = async (): Promise<ReferenceImage[]> => {
  const db = await openDatabase()

  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('images').objectStore('images').getAll()

      request.onsuccess = () =>
        resolve(
          (request.result as StoredReference[])
            .filter((image) => image.sessionId === getWorkspace().clientId)
            .sort((first, second) => first.createdAt - second.createdAt)
            .map(({ data, blob, ...image }) => ({
              ...image,
              blob: blob ?? new Blob(data ? [data] : [], { type: 'image/png' }),
            })),
        )

      request.onerror = () => reject(new Error('reference.storageError'))
    })
  } finally {
    db.close()
  }
}
