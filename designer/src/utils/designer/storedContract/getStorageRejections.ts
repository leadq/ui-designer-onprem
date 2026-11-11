import { rejectionState } from './constants'
import type { StorageRejection } from './types'

export const getStorageRejections = (): StorageRejection[] => rejectionState.rejections
