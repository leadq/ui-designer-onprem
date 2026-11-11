import { workspaceListeners } from './constants'

export const notifyWorkspace = () => {
  workspaceListeners.forEach((listener) => {
    listener()
  })
}
