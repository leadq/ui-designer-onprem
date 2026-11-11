import { workspaceListeners } from './constants'

export const subscribeWorkspacePersistence = (listener: () => void) => {
  workspaceListeners.add(listener)

  return () => workspaceListeners.delete(listener)
}
