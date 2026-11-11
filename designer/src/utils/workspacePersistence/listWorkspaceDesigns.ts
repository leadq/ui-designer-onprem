import { readWorkspaceValue } from './database'
import type { WorkspaceRecord } from './types'

export const listWorkspaceDesigns = async () => {
  const designs = await readWorkspaceValue<WorkspaceRecord[]>('designs')

  return designs.sort((first, second) => second.updatedAt - first.updatedAt)
}
