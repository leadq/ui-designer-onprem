import type { DesignDocument } from '@root/utils/designDocument'

import { componentLibraries, persistenceState, workspaceListeners } from './constants'
import { writeWorkspaceValues } from './database'
import { pruneOperationReceipts } from './pruneOperationReceipts'
import { getWorkspace } from './state'
import { type OperationReceipt } from './types'
import { updateWorkspaceDocument } from './updateWorkspaceDocument'

export const persistWorkspaceDocument = (document: unknown, receipt?: OperationReceipt) => {
  persistenceState.cancelScheduled?.()

  updateWorkspaceDocument(document)

  const state = getWorkspace()
  const record = state.active
  const savedDocument = state.lastDocument
  const design = record.document as DesignDocument

  componentLibraries.set(design.adapterId, design.savedDesigns ?? [])

  const values: Record<string, unknown[]> = {
    designs: [record],
    metadata: [
      { key: 'activeDesignId', value: record.id },
      { key: `componentLibrary:${design.adapterId}`, value: design.savedDesigns ?? [] },
    ],
  }

  if (receipt) {
    persistenceState.receipts.set(receipt.id, receipt)

    persistenceState.unsavedReceipts.set(receipt.id, receipt)
  }

  persistenceState.pendingWrites += 1

  workspaceListeners.forEach((listener) => {
    listener()
  })

  const write = persistenceState.writes
    .catch(() => {})
    .then(async () => {
      // Include only receipts whose application is contained in this captured revision.
      const receipts = [...persistenceState.unsavedReceipts.values()].filter(
        (item) => item.designId === record.id && (item.version ?? Infinity) <= record.revision,
      )

      await writeWorkspaceValues({
        ...values,
        ...(receipts.length
          ? { receipts: receipts.map((item) => ({ ...item, isPersisted: true })) }
          : {}),
      })

      receipts.forEach((item) => {
        persistenceState.unsavedReceipts.delete(item.id)

        persistenceState.receipts.set(item.id, { ...item, isPersisted: true })
      })

      if (receipts.length) {
        void pruneOperationReceipts().catch(() => {})
      }

      if (state.active.id === record.id) {
        state.savedDocument = savedDocument

        state.hasLibraryError = false
      }

      const hadError = state.hasError

      state.hasError = false

      if (hadError) {
        workspaceListeners.forEach((listener) => {
          listener()
        })
      }

      if (receipt) {
        persistenceState.receipts.set(receipt.id, { ...receipt, isPersisted: true })
      }
    })
    .catch((error: unknown) => {
      state.hasError = true

      workspaceListeners.forEach((listener) => {
        listener()
      })

      throw error
    })
    .finally(() => {
      persistenceState.pendingWrites -= 1

      workspaceListeners.forEach((listener) => {
        listener()
      })
    })

  persistenceState.writes = write

  return write
}
