import { type KeyboardEvent, useContext } from 'react'
import { ReferenceActionsContext } from '@root/contexts/ReferenceActionsContext'
import { useReferenceStore } from '@root/stores/referenceStore'
import { persistReferencePlacements } from '@root/utils/references/persistReferencePlacements'
import { getReferencePlacement, resizeReference } from '@root/utils/references/placement'
import { runReferenceSequence } from '@root/utils/references/runReferenceSequence'

const LARGE_KEYBOARD_STEP_PX = 10
const KEYBOARD_RESIZE_RATIO = 0.05

export const useReferenceKeyboard = (imageId: string, cancel: () => void) => {
  const { onRemove } = useContext(ReferenceActionsContext)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      cancel()

      return
    }

    const ids = useReferenceStore.getState().selectedIds

    if (!ids.includes(imageId)) {
      return
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()

      event.stopPropagation()

      void runReferenceSequence(ids, onRemove)

      return
    }

    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }

    if (!moves[event.key] && !['+', '=', '-'].includes(event.key)) {
      return
    }

    event.preventDefault()

    event.stopPropagation()

    const state = useReferenceStore.getState()
    const step = event.shiftKey ? LARGE_KEYBOARD_STEP_PX : 1

    for (const item of state.images.filter((item) => ids.includes(item.id))) {
      const start = getReferencePlacement(item)
      const move = moves[event.key]

      state.place(
        item.id,
        move
          ? {
              ...start,
              x: Math.max(0, start.x + move[0] * step),
              y: Math.max(0, start.y + move[1] * step),
            }
          : resizeReference(
              item,
              start,
              'e',
              start.width * (event.key === '-' ? -KEYBOARD_RESIZE_RATIO : KEYBOARD_RESIZE_RATIO),
              0,
            ),
      )
    }

    void persistReferencePlacements(ids)
  }

  return handleKeyDown
}
