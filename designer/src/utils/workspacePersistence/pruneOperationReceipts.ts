import { MAX_RECEIPTS } from './constants'
import { readWorkspaceValue } from './database'
import { type OperationReceipt } from './types'

export const pruneOperationReceipts = async () => {
  const all = await readWorkspaceValue<OperationReceipt[]>('receipts')

  if (all.length <= MAX_RECEIPTS) {
    return
  }

  const { openWorkspaceDatabase } = await import('./database')
  const db = await openWorkspaceDatabase()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('receipts', 'readwrite')

    all
      .sort((first, second) => second.createdAt - first.createdAt)
      .slice(MAX_RECEIPTS)
      .forEach((receipt) => {
        tx.objectStore('receipts').delete(receipt.id)
      })

    tx.oncomplete = () => resolve()

    tx.onabort = () => reject(new Error('WORKSPACE_WRITE_FAILED'))
  })
}
