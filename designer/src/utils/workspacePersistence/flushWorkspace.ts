import { persistenceState } from './constants'

export const flushWorkspace = () => {
  persistenceState.flushScheduled?.()

  return persistenceState.writes
}
