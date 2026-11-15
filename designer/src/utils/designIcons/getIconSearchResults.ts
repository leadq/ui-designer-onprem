import { getFilteredIcons } from './getFilteredIcons'

export const getIconSearchResults = (queries: string[], limit: number) => {
  const groups = queries.map((query) => ({
    query,
    entries: getFilteredIcons(query),
    matches: [] as string[],
  }))

  const depth = Math.max(...groups.map((group) => group.entries.length))
  let remaining = limit

  // Each nonempty query gets its first pick before the next round of candidates.
  for (let index = 0; index < depth && remaining > 0; index++) {
    for (const group of groups) {
      const entry = group.entries[index]

      if (entry) {
        group.matches.push(entry.key)

        remaining--
      }

      if (remaining === 0) {
        break
      }
    }
  }

  return {
    results: groups.map(({ query, entries, matches }) => ({
      query,
      matches,
      total: entries.length,
    })),
  }
}
