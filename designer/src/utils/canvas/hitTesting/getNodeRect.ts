import { getNodeElement } from './getNodeElement'

export const getNodeRect = (id: string, viewId?: string): DOMRect | null =>
  getNodeElement(id, viewId)?.getBoundingClientRect() ?? null
