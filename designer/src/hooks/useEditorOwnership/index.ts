import { useEffect, useState } from 'react'

type EditorOwnership = 'checking' | 'active' | 'blocked' | 'unavailable'

const EDITOR_LOCK_NAME = 'ui-designer-editor'
// Serialize effect replays so a released StrictMode owner finishes before retrying.
let pendingOwnership: Promise<void> = Promise.resolve()

/** The browser releases this exclusive lock when the owning document closes. */
export const useEditorOwnership = () => {
  const [ownership, setOwnership] = useState<EditorOwnership>('checking')

  useEffect(() => {
    if (!navigator.locks) {
      setOwnership('unavailable')

      return
    }

    let isActive = true
    let releaseLock: (() => void) | undefined

    const handlePageHide = () => {
      isActive = false

      setOwnership('checking')

      releaseLock?.()
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload()
      }
    }

    pendingOwnership = pendingOwnership
      .then(async () => {
        if (!isActive) {
          return
        }

        await navigator.locks.request(EDITOR_LOCK_NAME, { ifAvailable: true }, async (lock) => {
          if (!isActive) {
            return
          }

          if (!lock) {
            setOwnership('blocked')

            return
          }

          setOwnership('active')

          await new Promise<void>((resolve) => {
            releaseLock = resolve
          })
        })
      })
      .catch(() => {
        if (isActive) {
          setOwnership('unavailable')
        }
      })

    window.addEventListener('pagehide', handlePageHide)

    window.addEventListener('pageshow', handlePageShow)

    return () => {
      isActive = false

      releaseLock?.()

      window.removeEventListener('pagehide', handlePageHide)

      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  return ownership
}
