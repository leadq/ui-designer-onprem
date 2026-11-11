import { applyWorkspaceRecord } from './applyWorkspaceRecord'
import { getWorkspace } from './state'

export const createWorkspaceDesign = (document: unknown) => {
  const state = getWorkspace()

  applyWorkspaceRecord(
    {
      id: crypto.randomUUID(),
      clientId: state.clientId,
      document,
      revision: 1,
      updatedAt: Date.now(),
    },
    false,
  )
}
