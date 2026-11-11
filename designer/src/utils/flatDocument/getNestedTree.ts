import { getIds } from './getIds'
import { isRecord } from './isRecord'

/** Reject cycles, shared ownership, orphans and contradictory parent/order indexes. */
export const getNestedTree = (value: unknown): unknown[] => {
  if (!isRecord(value) || !isRecord(value.nodesById)) {
    throw new Error('Invalid flat node table')
  }

  const table = value.nodesById
  const visited = new Set<string>()

  const getRestore = (ids: string[], parentId: string | null, slotKey: string | null): unknown[] =>
    ids.map((id, index) => {
      if (!Object.hasOwn(table, id) || !isRecord(table[id]) || visited.has(id)) {
        throw new Error(`Missing, cyclic or shared flat node: ${id}`)
      }

      const record = table[id]

      if (
        record.id !== id ||
        record.parentId !== parentId ||
        record.slotKey !== slotKey ||
        record.index !== index
      ) {
        throw new Error(`Inconsistent flat location: ${id}`)
      }

      visited.add(id)

      const {
        childIds,
        slotChildIds,
        parentId: _parent,
        slotKey: _slot,
        index: _index,
        ...data
      } = record

      if (slotChildIds !== undefined && !isRecord(slotChildIds)) {
        throw new Error('Invalid flat slots')
      }

      return {
        ...data,
        children: getRestore(getIds(childIds), id, null),
        ...(isRecord(slotChildIds)
          ? {
              slots: Object.fromEntries(
                Object.entries(slotChildIds).map(([key, items]) => [
                  key,
                  getRestore(getIds(items), id, key),
                ]),
              ),
            }
          : {}),
      }
    })

  const nodes = getRestore(getIds(value.rootIds), null, null)

  if (visited.size !== Object.keys(table).length) {
    throw new Error('Orphan flat nodes')
  }

  return nodes
}
