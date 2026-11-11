import type { StorageRejection } from './types'

export const BACKUP_PREFIX = 'designer-rejected-json:'

export const rejectionState: { rejections: StorageRejection[]; areBackupsLoaded: boolean } = {
  rejections: [],
  areBackupsLoaded: false,
}

export const listeners = new Set<() => void>()
