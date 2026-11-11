import { PREFIX } from '@root/utils/preview/previewSession/constants'

const PREVIEW_TTL_MS = 1_800_000

export const removeExpiredPreviewSnapshots = (storage: Storage, now: number): void => {
  // Only temporary handoff records expire; saved designs and unfamiliar records stay.
  for (const key of Object.keys(storage).filter((item) => item.startsWith(PREFIX))) {
    try {
      if (now - JSON.parse(storage.getItem(key)!).createdAt > PREVIEW_TTL_MS) {
        storage.removeItem(key)
      }
    } catch {
      /* Leave unfamiliar or inaccessible records alone. */
    }
  }
}
