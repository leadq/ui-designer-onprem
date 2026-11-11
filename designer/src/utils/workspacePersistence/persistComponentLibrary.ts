import type { SlotComponent } from '@root/types/document'

import { componentLibraries, persistenceState } from './constants'
import { writeWorkspaceValues } from './database'
import { getWorkspace } from './getWorkspace'
import { notifyWorkspace } from './notifyWorkspace'

export const persistComponentLibrary = (adapterId: string, components: SlotComponent[]) => {
  const value: SlotComponent[] = JSON.parse(JSON.stringify(components))
  const state = getWorkspace()

  componentLibraries.set(adapterId, value)

  persistenceState.pendingWrites += 1

  notifyWorkspace()

  const write = persistenceState.writes
    .catch(() => {})
    .then(async () => {
      await writeWorkspaceValues({ metadata: [{ key: `componentLibrary:${adapterId}`, value }] })

      state.hasLibraryError = false
    })
    .catch((error: unknown) => {
      state.hasLibraryError = true

      throw error
    })
    .finally(() => {
      persistenceState.pendingWrites -= 1

      notifyWorkspace()
    })

  persistenceState.writes = write

  return write
}
