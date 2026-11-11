import { confirmWorkspaceChange } from '@root/stores/workspaceConfirmationStore'

import { persistenceState } from './constants'
import { getWorkspace } from './getWorkspace'
import { queueWorkspaceAutosave } from './queueWorkspaceAutosave'
import { saveCurrentDesign } from './saveCurrentDesign'

export const doWorkspaceTransition = async (
  apply: () => Promise<void> | void,
  shouldConfirm = true,
) => {
  const state = getWorkspace()

  if (state.isSwitching) {
    return false
  }

  state.isSwitching = true

  persistenceState.cancelScheduled?.()

  const previous = state.active

  try {
    const isDirty = state.lastDocument !== state.savedDocument || state.hasError
    const decision = shouldConfirm ? await confirmWorkspaceChange(isDirty) : 'discard'

    if (decision === 'cancel') {
      return false
    }

    if (state.active !== previous) {
      throw new Error('DESIGN_CHANGED_DURING_SWITCH')
    }

    if (decision === 'save') {
      await saveCurrentDesign()
    } else {
      // Discard explicitly allows leaving unsaved changes; existing writes must settle first.
      await persistenceState.writes.catch(() => {})
    }

    if (state.active !== previous) {
      throw new Error('DESIGN_CHANGED_DURING_SWITCH')
    }

    await apply()

    return true
  } finally {
    state.isSwitching = false

    // Resume a cancelled/failed transition only. New drafts do not autosave until an edit.
    if (state.active.id === previous.id && state.isAutoSaveEnabled) {
      queueWorkspaceAutosave(state.active.document)
    }
  }
}
