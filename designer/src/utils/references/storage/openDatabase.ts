export const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open('designer-reference-images', 1)

    request.onupgradeneeded = () => request.result.createObjectStore('images', { keyPath: 'id' })

    request.onsuccess = () => resolve(request.result)

    request.onerror = () => reject(new Error('reference.storageError'))
  })
