import { ICON_CATALOG } from './getIconEntry'
import { getIconSearchText } from './getIconSearchText'

const getSearchPhrase = (value: string) =>
  getIconSearchText(value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ')).replace(
    /\s+/g,
    ' ',
  )

export const getFilteredIcons = (query: string, catalog = ICON_CATALOG) => {
  const phrase = getSearchPhrase(query)

  if (!phrase) {
    return catalog
  }

  if (query.includes(':')) {
    const key = getIconSearchText(query)

    return catalog.filter((entry) => getIconSearchText(entry.key) === key)
  }

  const terms = phrase.split(' ')
  const compactName = terms.join('')
  const sortedWords = [...terms].sort().join(' ')
  const exact: typeof catalog = []
  const prefix: typeof catalog = []
  const partial: typeof catalog = []

  for (const entry of catalog) {
    if (!terms.every((term) => entry.searchText.includes(term))) {
      continue
    }

    const name = getSearchPhrase(entry.name)
    const hasSameWords = name.split(' ').sort().join(' ') === sortedWords

    if (name === phrase || getIconSearchText(entry.id) === compactName || hasSameWords) {
      exact.push(entry)
    } else if (name.startsWith(phrase)) {
      prefix.push(entry)
    } else {
      partial.push(entry)
    }
  }

  return [...exact, ...prefix, ...partial]
}
