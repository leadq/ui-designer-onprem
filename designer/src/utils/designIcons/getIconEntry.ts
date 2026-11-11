import { DESIGN_ICON_LIBRARY } from '@root/adapters/iconLibrary'

import { getIconSearchText } from './getIconSearchText'

const library = DESIGN_ICON_LIBRARY

export const ICON_CATALOG = library
  ? library.entries.map((entry) => ({
      ...entry,
      key: `${library.id}:${entry.id}`,
      library,
      searchText: getIconSearchText(
        [entry.name, entry.id, library.name, ...(entry.keywords ?? [])].join(' '),
      ),
    }))
  : []

if (new Set(ICON_CATALOG.map((entry) => entry.key)).size !== ICON_CATALOG.length) {
  throw new Error('Icon keys must be unique')
}

export const ICON_GLYPH_OPTIONS = ['', ...ICON_CATALOG.map((entry) => entry.key)]

const ICON_INDEX = new Map(ICON_CATALOG.map((entry) => [entry.key, entry]))

export const getIconEntry = (key: string) => ICON_INDEX.get(key)
