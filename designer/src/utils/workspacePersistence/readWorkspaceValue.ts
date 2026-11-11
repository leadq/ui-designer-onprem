import { openWorkspaceDatabase } from './openWorkspaceDatabase'

export const readWorkspaceValue = async <T>(store: string, key?: IDBValidKey): Promise<T> => {
  const db = await openWorkspaceDatabase()

  return new Promise((resolve, reject) => {
    const objectStore = db.transaction(store, 'readonly').objectStore(store)
    const request = key === undefined ? objectStore.getAll() : objectStore.get(key)

    request.onsuccess = () => resolve(request.result as T)

    request.onerror = () => reject(new Error('WORKSPACE_READ_FAILED'))
  })
}
