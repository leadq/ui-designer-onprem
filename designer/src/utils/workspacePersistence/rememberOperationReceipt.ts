import { MAX_RECEIPTS, persistenceState } from './constants'
import type { OperationReceipt } from './types'

export const rememberOperationReceipt = (receipt: OperationReceipt) => {
  persistenceState.receipts.set(receipt.id, receipt)

  if (persistenceState.receipts.size > MAX_RECEIPTS) {
    persistenceState.receipts.delete(persistenceState.receipts.keys().next().value!)
  }
}
