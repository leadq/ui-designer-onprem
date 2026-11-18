import type { IconLibrary } from '@root/types/iconLibrary'

import { getLucideExportConfig } from './utils/getLucideExportConfig'
import names from './catalog.json' with { type: 'json' }

export const lucideIcons: IconLibrary = {
  id: 'lucide',
  name: 'Lucide',
  packageName: 'lucide-react',
  componentMeta: {
    description: 'Independent symbol from the registered Lucide icon catalog.',
    visualHints: [
      'A small standalone symbol can appear beside content without a button surface or input field.',
      'A symbol inside another control may belong to that control; inspect its native props or slots first.',
    ],
    recipes: [{
      id: 'standalone-symbol',
      title: 'Independent symbol',
      when: 'The symbol is independent content rather than a native part of another control.',
      instructions: [
        'Use search_icons to choose a registered glyph and assign its full ID to props.glyph.',
        'Use props.size for the symbol size and accessibleLabel when the symbol conveys meaning.',
      ],
      example: {
        id: 'example-search-symbol',
        type: 'icon',
        props: { glyph: 'lucide:Search', size: 24, accessibleLabel: 'Search' },
        style: {},
        children: [],
      },
    }],
  },
  entries: names.map((name) => ({
    id: name,
    name: name.replace(/([a-z0-9])([A-Z])/g, '$1 $2'),
    importName: name,
  })),
  load: async (id) => {
    const { icons } = await import('lucide-react')
    const Icon = icons[id as keyof typeof icons]

    if (!Icon) {
      throw new Error(`Unknown Lucide icon: ${id}`)
    }

    return Icon
  },
  getExportConfig: getLucideExportConfig,
}
