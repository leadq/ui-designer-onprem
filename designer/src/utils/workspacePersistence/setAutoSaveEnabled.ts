import { writeWorkspaceValues } from './database'
import { getWorkspace } from './getWorkspace'
import { queueWorkspaceAutosave } from './queueWorkspaceAutosave'

export const setAutoSaveEnabled = async (isEnabled: boolean) => {
  await writeWorkspaceValues({ metadata: [{ key: 'autoSaveEnabled', value: isEnabled }] })

  const state = getWorkspace()

  state.isAutoSaveEnabled = isEnabled

  queueWorkspaceAutosave(state.active.document)
}
