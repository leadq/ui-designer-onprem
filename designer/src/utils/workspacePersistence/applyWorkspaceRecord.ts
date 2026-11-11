import { setActiveRegistry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { parseDesignDocument } from '@root/utils/designDocument'

import { getCurrentDesign } from './getCurrentDesign'
import { getWorkspace } from './getWorkspace'
import { notifyWorkspace } from './notifyWorkspace'
import type { WorkspaceRecord } from './types'

export const applyWorkspaceRecord = (record: WorkspaceRecord, isSaved: boolean) => {
  const document = parseDesignDocument(record.document)
  const state = getWorkspace()
  const previousAdapter = useEditorStore.getState().adapterId

  state.isApplying = true

  try {
    useEditorStore.getState().loadDesignDocument(document)

    const loaded = getCurrentDesign()

    state.active = { ...record, document: loaded }

    state.lastDocument = JSON.stringify(loaded)

    state.savedDocument = isSaved ? JSON.stringify(document) : undefined

    state.hasError = false
  } catch (error) {
    setActiveRegistry(previousAdapter)

    throw error
  } finally {
    state.isApplying = false

    notifyWorkspace()
  }
}
