import { PREFIX } from '@root/utils/preview/previewSession/constants'
import type { PreviewSnapshot } from '@root/utils/preview/previewSession/types'

import { removeExpiredPreviewSnapshots } from './removeExpiredPreviewSnapshots'

/** Synchronous command: stay inside the click event to preserve popup permission. */
export const openPreviewTab = (snapshot: PreviewSnapshot): void => {
  const key = `${PREFIX}${crypto.randomUUID()}`

  try {
    removeExpiredPreviewSnapshots(localStorage, Date.now())

    localStorage.setItem(key, JSON.stringify(snapshot))

    const url = new URL(window.location.href)

    url.hash = `/preview/${key.slice(PREFIX.length)}`

    const opened = window.open(url.href, '_blank')

    if (!opened) {
      throw new Error('Preview tab was blocked')
    }

    opened.opener = null
  } catch (error) {
    // Cleanup failure must not hide the original failure or prevent UI feedback.
    try {
      localStorage.removeItem(key)
    } catch {
      /* Storage may be unavailable; the temporary record expires on a later open. */
    }

    throw error
  }
}
