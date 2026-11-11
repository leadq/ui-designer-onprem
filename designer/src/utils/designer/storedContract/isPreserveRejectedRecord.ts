import { BACKUP_PREFIX } from './constants'
import { registerStorageRejection } from './registerStorageRejection'

export const isPreserveRejectedRecord = (key: string, raw: string, error: unknown): boolean => {
  const rejection = registerStorageRejection(key, raw, error)

  try {
    // Never replace an earlier backup; failed backups leave the original storage untouched.
    for (let index = 0; ; index += 1) {
      const backupKey = `${BACKUP_PREFIX}${key}:${index}`
      const backup = localStorage.getItem(backupKey)

      if (backup === JSON.stringify(rejection)) {
        return true
      }

      if (backup !== null) {
        continue
      }

      localStorage.setItem(backupKey, JSON.stringify(rejection))

      return true
    }
  } catch {
    return false
  }
}
