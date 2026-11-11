import { areRectsEqual } from './areRectsEqual'

export const areRectMapsEqual = (
  first: Record<string, DOMRect>,
  second: Record<string, DOMRect>,
): boolean =>
  Object.keys(first).length === Object.keys(second).length &&
  Object.keys(first).every((id) => areRectsEqual(first[id], second[id] ?? null))
