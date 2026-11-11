import type { Registry } from '@root/types/componentContract'

import type { ColorToken } from './types'

export const REGISTRY_PALETTES = new WeakMap<Registry, ColorToken[]>()
