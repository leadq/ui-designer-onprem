import { parseDesignDocument } from '@root/utils/designDocument'

import { PREFIX } from './constants'
import type { PreviewSnapshot } from './types'

const PREVIEW_TTL_HOURS = 24
const MINUTES_PER_HOUR = 60
const MILLISECONDS_PER_MINUTE = 60000

export const readPreviewSnapshot = (id: string): PreviewSnapshot | null => {
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return null
  }

  const key = `${PREFIX}${id}`

  try {
    const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key)

    if (!raw) {
      return null
    }

    const candidate = JSON.parse(raw)

    if (
      typeof candidate.createdAt !== 'number' ||
      Date.now() - candidate.createdAt >
        PREVIEW_TTL_HOURS * MINUTES_PER_HOUR * MILLISECONDS_PER_MINUTE
    ) {
      return null
    }

    const snapshot: PreviewSnapshot = {
      document: parseDesignDocument(candidate.document),
      createdAt: candidate.createdAt,
      ...(typeof candidate.flowId === 'string' ? { flowId: candidate.flowId } : {}),
    }

    sessionStorage.setItem(key, JSON.stringify(snapshot))

    localStorage.removeItem(key)

    return snapshot
  } catch {
    return null
  }
}
