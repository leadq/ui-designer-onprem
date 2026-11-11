import { rejectionState } from './constants'
import { isPreserveRejectedRecord } from './isPreserveRejectedRecord'

export const writeRecoveredStorage = (key: string, value: unknown): void => {
  const previous = localStorage.getItem(key)

  const rejected = rejectionState.rejections.find(
    (item) => item.key === key && item.raw === previous,
  )

  if (rejected && !isPreserveRejectedRecord(key, rejected.raw, new Error(rejected.reason))) {
    return
  }

  localStorage.setItem(key, JSON.stringify(value))
}
