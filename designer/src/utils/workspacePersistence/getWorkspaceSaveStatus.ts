import { persistenceState, workspace } from './constants'

export const getWorkspaceSaveStatus = () => {
  const state = workspace.current

  if (state?.hasError || state?.hasLibraryError) {
    return 'error'
  }

  if (persistenceState.pendingWrites > 0) {
    return 'saving'
  }

  return state && state.lastDocument !== state.savedDocument ? 'unsaved' : 'saved'
}
