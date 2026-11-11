export const getIds = (value: unknown): string[] => {
  if (!Array.isArray(value) || !value.every((id) => typeof id === 'string')) {
    throw new Error('Invalid flat child IDs')
  }

  return value
}
