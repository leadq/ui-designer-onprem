import type { IconLibrary } from '@root/types/iconLibrary'

import { getTablerExportConfig } from './utils/getTablerExportConfig'
import names from './catalog.json' with { type: 'json' }

const ICON_NAME_PREFIX_LENGTH = 4

export const tablerIcons: IconLibrary = {
  id: 'tabler',
  name: 'Tabler',
  packageName: '@tabler/icons-react',
  entries: names.map((name) => ({
    id: name,
    name: name.slice(ICON_NAME_PREFIX_LENGTH).replace(/([a-z0-9])([A-Z])/g, '$1 $2'),
    importName: name,
  })),
  load: async (id) => {
    const { icons } = await import('@tabler/icons-react')
    const Icon = icons[id as keyof typeof icons]

    if (!Icon) {
      throw new Error(`Unknown Tabler icon: ${id}`)
    }

    return Icon
  },
  getExportConfig: getTablerExportConfig,
}
