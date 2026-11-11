import { isPreserveRejectedRecord } from './isPreserveRejectedRecord'

export const writeStoredContract = <T>(
  key: string,
  value: T,
  parse: (value: unknown) => T,
): void => {
  const previous = localStorage.getItem(key)

  if (previous !== null) {
    try {
      parse(JSON.parse(previous))
    } catch (error) {
      if (!isPreserveRejectedRecord(key, previous, error)) {
        return
      }
    }
  }

  localStorage.setItem(key, JSON.stringify(value))
}
