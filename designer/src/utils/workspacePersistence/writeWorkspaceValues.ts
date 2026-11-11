import { openWorkspaceDatabase } from './openWorkspaceDatabase'

export const writeWorkspaceValues = async (values: Record<string, unknown[]>) => {
  const db = await openWorkspaceDatabase()

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(Object.keys(values), 'readwrite')

    transaction.oncomplete = () => resolve()

    transaction.onabort = () => reject(new Error('WORKSPACE_WRITE_FAILED'))

    transaction.onerror = () => reject(new Error('WORKSPACE_WRITE_FAILED'))

    try {
      Object.entries(values).forEach(([name, records]) => {
        const store = transaction.objectStore(name)

        records.forEach((record) => {
          store.put(record)
        })
      })
    } catch {
      transaction.abort()

      reject(new Error('WORKSPACE_WRITE_FAILED'))
    }
  })
}
