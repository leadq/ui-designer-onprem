import { getFilteredIcons } from './getFilteredIcons'
import { ICON_CATALOG } from './getIconEntry'
import { getIconSearchText } from './getIconSearchText'

const KEYWORD_MATCH_RANK = 2

const getSearchRank = (name: string, phrase: string, isExact: boolean) => {
  if (isExact || name === phrase) {
    return 0
  }

  return name.startsWith(phrase) ? 1 : KEYWORD_MATCH_RANK
}

export const getIconSearchResults = (queries: string[], limit: number) => {
  const hits = queries.flatMap((query) => {
    const words = query.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ')
    const phrase = getIconSearchText(words).replace(/\s+/g, ' ')
    const compactName = phrase.replaceAll(' ', '')
    const isQualified = query.includes(':')

    const candidates = isQualified
      ? ICON_CATALOG.filter((entry) => getIconSearchText(entry.key) === getIconSearchText(query))
      : getFilteredIcons(phrase)

    return candidates
      .map((entry) => ({
        key: entry.key,
        rank: getSearchRank(
          getIconSearchText(entry.name),
          phrase,
          isQualified || getIconSearchText(entry.id) === compactName,
        ),
      }))
      .sort((left, right) => left.rank - right.rank)
      .map((hit, index) => ({ ...hit, index }))
  })

  // Interleave equally ranked alternatives so a broad first phrase cannot fill the entire page.
  hits.sort((left, right) => left.rank - right.rank || left.index - right.index)

  const keys = [...new Set(hits.map((hit) => hit.key))]

  return { matches: keys.slice(0, limit), total: keys.length }
}
