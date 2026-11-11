let database: Promise<IDBDatabase> | undefined

export const openWorkspaceDatabase = () => {
  database =
    database ??
    new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('designer-workspaces', 1)

      request.onupgradeneeded = () => {
        request.result.createObjectStore('metadata', { keyPath: 'key' })

        request.result.createObjectStore('designs', { keyPath: 'id' })

        request.result.createObjectStore('receipts', { keyPath: 'id' })
      }

      request.onerror = () => reject(new Error('WORKSPACE_STORAGE_UNAVAILABLE'))

      request.onblocked = () => reject(new Error('WORKSPACE_STORAGE_BLOCKED'))

      request.onsuccess = () => {
        request.result.onversionchange = () => {
          request.result.close()

          database = undefined
        }

        resolve(request.result)
      }
    })

  return database
}
