import type { SlotComponent } from '@root/types/document'

import type { OperationReceipt, WorkspaceState } from './types'

export const workspace: { current?: WorkspaceState } = {}

export const persistenceState = {
  pendingWrites: 0,
  writes: Promise.resolve() as Promise<void>,
  receipts: new Map<string, OperationReceipt>(),
  unsavedReceipts: new Map<string, OperationReceipt>(),
  flushScheduled: undefined as (() => void) | undefined,
  cancelScheduled: undefined as (() => void) | undefined,
}

export const MAX_RECEIPTS = 100

export const workspaceListeners = new Set<() => void>()

export const componentLibraries = new Map<string, SlotComponent[]>()
