import { workspace } from './constants'

export const getWorkspace = () => {
  if (!workspace.current) {
    throw new Error('WORKSPACE_NOT_READY')
  }

  return workspace.current
}
