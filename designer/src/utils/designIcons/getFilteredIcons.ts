import { ICON_CATALOG } from './getIconEntry'
import { getIconSearchText } from './getIconSearchText'

export const getFilteredIcons = (query: string, catalog = ICON_CATALOG) => {
  const terms = getIconSearchText(query).split(/\s+/).filter(Boolean)

  return catalog.filter((entry) => terms.every((term) => entry.searchText.includes(term)))
}
