import { applyWorkspaceRecord } from './applyWorkspaceRecord'
import { persistenceState } from './constants'
import { readWorkspaceValue, writeWorkspaceValues } from './database'
import { notifyWorkspace } from './notifyWorkspace'
import { getWorkspace } from './state'
import type { WorkspaceRecord } from './types'

export const activateWorkspaceDesign = async (id: string) => {
  const state = getWorkspace()
  const previous = state.active
  const record = await readWorkspaceValue<WorkspaceRecord | undefined>('designs', id)

  if (!record) {
    throw new Error('DESIGN_NOT_FOUND')
  }

  if (state.active.id !== previous.id || state.active.revision !== previous.revision) {
    throw new Error('DESIGN_CHANGED_DURING_SWITCH')
  }

  applyWorkspaceRecord({ ...record, clientId: state.clientId }, true)

  persistenceState.pendingWrites += 1

  notifyWorkspace()

  try {
    await writeWorkspaceValues({ metadata: [{ key: 'activeDesignId', value: id }] })
  } catch (error) {
    // Display and write target stay together even when the active-record pointer cannot be saved.
    state.hasError = true

    notifyWorkspace()

    throw error
  } finally {
    persistenceState.pendingWrites -= 1

    notifyWorkspace()
  }
}
