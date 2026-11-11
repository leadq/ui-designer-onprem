import type { PropSchema } from '@root/types/propSchema'

export const getSlotRenderMode = (schema: PropSchema): 'node' | 'callback' =>
  schema.slotRenderMode ?? (schema.key === 'renderItem' ? 'callback' : 'node')
