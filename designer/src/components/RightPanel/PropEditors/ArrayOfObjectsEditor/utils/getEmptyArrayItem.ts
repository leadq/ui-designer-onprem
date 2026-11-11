import type { ArrayItemField } from '@root/types/propSchema'

export const getEmptyArrayItem = (schema: ArrayItemField[]): Record<string, unknown> => {
  const item: Record<string, unknown> = {}

  for (const field of schema) {
    switch (field.type) {
      case 'number':
        item[field.key] = 0

        break
      case 'boolean':
        item[field.key] = false

        break

      default:
        item[field.key] = ''
    }
  }

  return item
}
