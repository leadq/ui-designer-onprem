import { persistenceState } from './constants'
import { notifyWorkspace } from './notifyWorkspace'
import { persistWorkspaceDocument } from './persistWorkspaceDocument'
import { getWorkspace } from './state'
import { updateWorkspaceDocument } from './updateWorkspaceDocument'

export const AUTOSAVE_DEBOUNCE_MS = 5000

export const queueWorkspaceAutosave = (document: unknown) => {
  const state = getWorkspace()

  updateWorkspaceDocument(document)

  persistenceState.cancelScheduled?.()

  if (state.isAutoSaveEnabled && !state.isSwitching && state.lastDocument !== state.savedDocument) {
    const flush = () => {
      void persistWorkspaceDocument(getWorkspace().active.document).catch(() => {})
    }

    const timer = window.setTimeout(flush, AUTOSAVE_DEBOUNCE_MS)

    persistenceState.flushScheduled = flush

    persistenceState.cancelScheduled = () => {
      clearTimeout(timer)

      persistenceState.flushScheduled = undefined

      persistenceState.cancelScheduled = undefined
    }
  }

  notifyWorkspace()
}
