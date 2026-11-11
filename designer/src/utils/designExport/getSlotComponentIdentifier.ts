import type { SlotComponent } from '@root/types/document'

/**
 * Clean a slot component name to be a valid JavaScript component identifier.
 */
export const getSlotComponentIdentifier = (component: SlotComponent): string =>
  `SavedDesign_${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}`
