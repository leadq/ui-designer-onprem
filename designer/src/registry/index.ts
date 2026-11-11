import { DEFAULT_ADAPTER_ID, getAdapter } from '@root/adapters'
import type { Registry } from '@root/types/componentContract'
import { setRegistryPalette } from '@root/utils/colorTokens/setRegistryPalette'

import { structuralRegistry } from './structuralRegistry'

export let registry: Registry = {
  ...getAdapter(DEFAULT_ADAPTER_ID).registry,
  ...structuralRegistry,
}

setRegistryPalette(registry, getAdapter(DEFAULT_ADAPTER_ID).colors)

export const setActiveRegistry = (adapterId: string): void => {
  registry = { ...getAdapter(adapterId).registry, ...structuralRegistry }

  setRegistryPalette(registry, getAdapter(adapterId).colors)
}
