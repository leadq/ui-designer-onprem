import { LEGACY_ADAPTER_ID } from '@root/adapters'

export const getAdapterStorageKey = (key: string, adapterId: string): string =>
  adapterId === LEGACY_ADAPTER_ID ? key : `${key}-${adapterId}`
