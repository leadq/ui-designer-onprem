import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'
import { type DesignChange, getDesignWithChanges } from '@root/utils/designer/getDesignWithChanges'
import { getValidatedDesign } from '@root/utils/designer/getValidatedDesign'
import { MAX_RECEIPTS, persistenceState } from '@root/utils/workspacePersistence/constants'
import {
  persistWorkspaceDocument,
  pruneOperationReceipts,
  readOperationReceipt,
  rememberOperationReceipt,
} from '@root/utils/workspacePersistence/persistence'
import { getWorkspace } from '@root/utils/workspacePersistence/state'
import type { OperationReceipt } from '@root/utils/workspacePersistence/types'

import { getLiveDocument, getLiveTarget, getValueHash } from './document'

export const getBridgeMutationResult = async (
  operation: string,
  args: Record<string, unknown>,
  isCancelled = () => false,
) => {
  if (typeof args.requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(args.requestId)) {
    throw new Error('INVALID_REQUEST_ID')
  }

  const before = getLiveDocument()
  const target = getLiveTarget()
  const signature = await getValueHash({ operation, args })
  const existing = await readOperationReceipt(args.requestId)

  if (existing) {
    if (existing.signature !== signature) {
      throw new Error('REQUEST_ID_REUSED: arguments differ')
    }

    return existing
  }

  if (isCancelled()) {
    throw new Error('REQUEST_CANCELLED')
  }

  if (
    getWorkspace().isSwitching ||
    args.designId !== target.designId ||
    args.editorId !== target.editorId ||
    args.expectedVersion !== target.version ||
    JSON.stringify(before) !== JSON.stringify(getLiveDocument()) ||
    JSON.stringify(target) !== JSON.stringify(getLiveTarget())
  ) {
    throw new Error('DESIGN_CONFLICT: read current designId/editorId/version')
  }

  if (persistenceState.unsavedReceipts.size >= MAX_RECEIPTS) {
    throw new Error('WORKSPACE_UNSAVED_OPERATIONS: save or export before more agent edits')
  }

  const state = useEditorStore.getState()

  if (state.previewMode) {
    throw new Error('EDITOR_NOT_EDITABLE')
  }

  if (
    operation === 'import_design' &&
    Array.isArray(args.referenceIds) &&
    args.referenceIds.some(
      (id) => !useReferenceStore.getState().images.some((image) => image.id === id),
    )
  ) {
    throw new Error('REFERENCE_UNAVAILABLE')
  }

  let frameIds: string[]

  if (operation === 'update_design') {
    const updated = getDesignWithChanges(before, args.changes as DesignChange[])

    frameIds = state.applyGeneratedUpdate(updated.document, updated.changedNodeIds)
  } else {
    const validated = getValidatedDesign(args.document, 'nested')

    if (!('document' in validated) || !('nodes' in validated.document)) {
      throw new Error('INVALID_DESIGN')
    }

    frameIds = state.appendGeneratedDesign(validated.document)
  }

  const receipt: OperationReceipt = {
    id: args.requestId,
    designId: target.designId,
    signature,
    status: 'applied',
    frameIds,
    version: getLiveTarget().version,
    isPersisted: false,
    createdAt: Date.now(),
  }

  rememberOperationReceipt(receipt)

  useReferenceStore.getState().setOperation('applied')

  try {
    await persistWorkspaceDocument(getLiveDocument(), receipt)

    void pruneOperationReceipts().catch(() => {})

    return { ...receipt, isPersisted: true }
  } catch {
    // Application happened. Reporting it as unapplied would invite a duplicate mutation.
    return {
      ...receipt,
      message: 'Applied in browser; IndexedDB write failed. Export your design.',
    }
  }
}
