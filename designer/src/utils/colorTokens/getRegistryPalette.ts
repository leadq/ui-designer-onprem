import type { Registry } from '@root/types/componentContract'

import { REGISTRY_PALETTES } from './paletteState'

export const getRegistryPalette = (registry: Registry) => REGISTRY_PALETTES.get(registry) ?? []
