import { persistenceState } from './constants'
import { readWorkspaceValue } from './database'
import type { OperationReceipt } from './types'

export const readOperationReceipt = async (id: string) =>
  persistenceState.unsavedReceipts.get(id) ??
  persistenceState.receipts.get(id) ??
  (await readWorkspaceValue<OperationReceipt | undefined>('receipts', id))
