import { listeners } from './constants'

export const subscribeStorageRejections = (listener: () => void): (() => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}
