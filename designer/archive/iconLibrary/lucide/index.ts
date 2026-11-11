import type { IconLibrary } from '@root/types/iconLibrary'

import { getLucideExportConfig } from './utils/getLucideExportConfig'
import names from './catalog.json' with { type: 'json' }

export const lucideIcons: IconLibrary = {
  id: 'lucide',
  name: 'Lucide',
  packageName: 'lucide-react',
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
