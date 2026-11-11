import type { Registry } from '@root/types/componentContract'

import { REGISTRY_PALETTES } from './paletteState'
import type { ColorToken } from './types'

export const setRegistryPalette = (registry: Registry, palette: ColorToken[] = []) => {
  if (new Set(palette.map((token) => token.id)).size !== palette.length) {
    throw new Error('Duplicate color token IDs')
  }

  REGISTRY_PALETTES.set(registry, palette)
}
