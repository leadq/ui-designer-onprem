import { listeners, rejectionState } from './constants'

export const registerStorageRejection = (key: string, raw: string, error: unknown) => {
  const rejection = { key, raw, reason: error instanceof Error ? error.message : String(error) }

  if (!rejectionState.rejections.some((item) => item.key === key && item.raw === raw)) {
    rejectionState.rejections = [...rejectionState.rejections, rejection]

    listeners.forEach((listener) => {
      listener()
    })
  }

  return rejection
}
