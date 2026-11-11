import { BACKUP_PREFIX, rejectionState } from './constants'
import { isPreserveRejectedRecord } from './isPreserveRejectedRecord'

export const readStoredContract = <T>(
  key: string,
  parse: (value: unknown) => T,
  fallback: T,
): T => {
  if (!rejectionState.areBackupsLoaded) {
    rejectionState.areBackupsLoaded = true

    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const backupKey = localStorage.key(index)

        if (!backupKey?.startsWith(BACKUP_PREFIX)) {
          continue
        }

        const record = JSON.parse(localStorage.getItem(backupKey) ?? 'null')

        if (
          record &&
          typeof record.key === 'string' &&
          typeof record.raw === 'string' &&
          typeof record.reason === 'string'
        ) {
          rejectionState.rejections = [...rejectionState.rejections, record]
        }
      }
    } catch {
      /* Storage may be unavailable; retain the original records. */
    }
  }

  let raw: string | null = null

  try {
    raw = localStorage.getItem(key)

    return raw === null ? fallback : parse(JSON.parse(raw))
  } catch (error) {
    if (raw !== null) {
      isPreserveRejectedRecord(key, raw, error)
    }

    return fallback
  }
}
