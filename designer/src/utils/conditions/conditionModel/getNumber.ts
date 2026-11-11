export const getNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string' || !value.trim() || !Number.isFinite(Number(value))) {
    return null
  }

  return Number(value)
}
