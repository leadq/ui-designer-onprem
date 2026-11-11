import { create } from 'zustand'

export type WorkspaceDecision = 'save' | 'discard' | 'cancel'

interface WorkspaceConfirmation {
  request: { isDirty: boolean; resolve: (decision: WorkspaceDecision) => void } | null
}

export const useWorkspaceConfirmation = create<WorkspaceConfirmation>(() => ({ request: null }))

export const confirmWorkspaceChange = (isDirty: boolean) =>
  new Promise<WorkspaceDecision>((resolve) => {
    useWorkspaceConfirmation.setState({ request: { isDirty, resolve } })
  })

export const resolveWorkspaceChange = (decision: WorkspaceDecision) => {
  const request = useWorkspaceConfirmation.getState().request

  useWorkspaceConfirmation.setState({ request: null })

  request?.resolve(decision)
}
