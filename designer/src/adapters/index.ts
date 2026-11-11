import { setRegistryPalette } from '../utils/colorTokens/setRegistryPalette';

import type { UIAdapter } from '../types/componentContract';
import { iconRegistry } from '../registry/designIconRegistry';

// Register the institution adapter here; archived samples are not active.
export const UI_ADAPTERS: Record<string, UIAdapter> = {};

// Independent design assets are available to every registered UI adapter.
for (const adapter of Object.values(UI_ADAPTERS)) {
  Object.assign(adapter.registry, iconRegistry);
  setRegistryPalette(adapter.registry, adapter.colors);
}

// Declaration order is also dropdown order. The first adapter starts new designs.
export const DEFAULT_ADAPTER_ID = Object.keys(UI_ADAPTERS)[0];
if (!DEFAULT_ADAPTER_ID) throw new Error('At least one UI adapter must be registered');

// Unlabelled historical documents/storage belong to Mantine, regardless of current order.
export const LEGACY_ADAPTER_ID = 'mantine';

export const getAdapter = (id: string): UIAdapter => {
  const adapter = UI_ADAPTERS[id];

  if (!adapter) {
    throw new Error(`Unsupported UI adapter: ${id}`);
  }

  return adapter;
};
