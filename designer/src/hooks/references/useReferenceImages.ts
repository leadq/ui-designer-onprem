import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  getMcpConnectionStatus,
  subscribeMcpConnectionStatus,
} from '@root/stores/mcpConnectionStore'
import { useReferenceStore } from '@root/stores/referenceStore'
import { fitCanvas } from '@root/utils/canvas/navigation'
import { normalizeReference } from '@root/utils/references/normalize'
import { getReferencePlacement } from '@root/utils/references/placement'
import { runReferenceSequence } from '@root/utils/references/runReferenceSequence'
import { readReferences, writeReference } from '@root/utils/references/storage'

const MAX_REFERENCE_IMAGES = 8

export const useReferenceImages = () => {
  const images = useReferenceStore((state) => state.images)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState<number | null>(null)
  const status = useSyncExternalStore(subscribeMcpConnectionStatus, getMcpConnectionStatus)
  const syncedIds = status === 'connected' ? images.map((image) => image.id) : []
  const controller = useRef<AbortController | null>(null)

  useEffect(() => {
    let active = true

    readReferences()
      .then((images) => {
        if (active) {
          useReferenceStore.getState().setImages(images)
        }
      })
      .catch(() => {
        if (active) {
          setError('reference.storageError')
        }
      })

    return () => {
      active = false

      controller.current?.abort()
    }
  }, [])

  const run = async (work: (signal: AbortSignal) => Promise<void> | void) => {
    if (controller.current) {
      return
    }

    const operation = new AbortController()

    controller.current = operation

    setError('')

    setProgress(0)

    try {
      await work(operation.signal)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'reference.storageError')
    } finally {
      controller.current = null

      setProgress(null)
    }
  }

  const handleAdd = (files: File[]) =>
    run(async (signal) => {
      await runReferenceSequence(files, async (file) => {
        if (signal.aborted) {
          throw new Error('reference.cancelled')
        }

        if (useReferenceStore.getState().images.length >= MAX_REFERENCE_IMAGES) {
          throw new Error('reference.limit')
        }

        const image = await normalizeReference(file)

        if (signal.aborted) {
          throw new Error('reference.cancelled')
        }

        image.placement = getReferencePlacement(image, useReferenceStore.getState().images.length)

        await writeReference(image)

        const state = useReferenceStore.getState()

        state.setImages([...state.images, image])

        state.select(image.id)

        requestAnimationFrame(() => fitCanvas(true))
      })
    })

  const handleSync = () =>
    run(() => {
      if (getMcpConnectionStatus() !== 'connected') {
        throw new Error('reference.syncError')
      }
    })

  const handleRemove = (id: string) =>
    run(async () => {
      await writeReference(id)

      useReferenceStore
        .getState()
        .setImages(useReferenceStore.getState().images.filter((image) => image.id !== id))
    })

  return {
    images,
    error,
    progress,
    syncedIds,
    handleAdd,
    handleSync,
    handleRemove,
    handleCancel: () => controller.current?.abort(),
  }
}
