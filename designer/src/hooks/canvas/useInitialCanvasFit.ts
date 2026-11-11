import { type RefObject, useEffect, useRef } from 'react'
import { fitCanvas } from '@root/utils/canvas/navigation'

const INITIAL_FIT_SETTLE_MS = 120

/** Fit once per opened document, after panel/font layout settles; never chase edits. */
export const useInitialCanvasFit = (
  viewportRef: RefObject<HTMLDivElement>,
  layerRef: RefObject<HTMLDivElement>,
  revision: number,
  isPreview: boolean,
) => {
  const fittedRevision = useRef<number | null>(null)

  useEffect(() => {
    const viewport = viewportRef.current
    const layer = layerRef.current

    if (isPreview || !viewport || !layer || fittedRevision.current === revision) {
      return
    }

    let isStopped = false
    let timer = 0
    let cancelFit: (() => void) | undefined
    const observer = new ResizeObserver(() => schedule())

    const finish = () => {
      if (isStopped) {
        return
      }

      isStopped = true

      fittedRevision.current = revision

      observer.disconnect()

      cancelFit = fitCanvas(true)
    }

    const schedule = () => {
      if (isStopped) {
        return
      }

      window.clearTimeout(timer)

      timer = window.setTimeout(finish, INITIAL_FIT_SETTLE_MS)
    }

    const stop = () => {
      isStopped = true

      observer.disconnect()

      window.clearTimeout(timer)

      cancelFit?.()
    }

    const handleInteraction = () => {
      fittedRevision.current = revision

      stop()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Saving does not change the camera or cancel a newly opened document's fit.
      if (
        event.key === 'Control' ||
        event.key === 'Meta' ||
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's')
      ) {
        return
      }

      handleInteraction()
    }

    observer.observe(viewport)

    observer.observe(layer)

    schedule()

    document.fonts.ready.then(() => {
      if (!isStopped) {
        schedule()
      }
    })

    // An explicit user gesture always takes precedence over initial framing.
    window.addEventListener('pointerdown', handleInteraction, true)

    viewport.addEventListener('wheel', handleInteraction, true)

    window.addEventListener('keydown', handleKeyDown, true)

    return () => {
      stop()

      window.removeEventListener('pointerdown', handleInteraction, true)

      viewport.removeEventListener('wheel', handleInteraction, true)

      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [revision, isPreview, viewportRef, layerRef])
}
