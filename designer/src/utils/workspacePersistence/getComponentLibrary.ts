import type { SlotComponent } from '@root/types/document'

import { componentLibraries } from './constants'

export const getComponentLibrary = (adapterId: string): SlotComponent[] =>
  JSON.parse(JSON.stringify(componentLibraries.get(adapterId) ?? []))
