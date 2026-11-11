import type { DragEndEvent } from '@dnd-kit/core'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { getDropTarget } from '@root/utils/canvas/hitTesting'

import type { ActiveItem } from '../hooks/useEditorDrag'

type DropActions = Pick<
  ReturnType<typeof useEditorStore.getState>,
  'addNode' | 'insertSavedDesign' | 'moveNode'
>

export const applyEditorDrop = (
  event: DragEndEvent,
  finalDwellId: string | undefined,
  pointer: { x: number; y: number },
  { addNode, insertSavedDesign, moveNode }: DropActions,
) => {
  const { active } = event
  const activeData = active.data.current as ActiveItem | null

  if (!activeData) {
    return
  }

  const activeId = 'id' in activeData ? String(activeData.id) : active.id.toString()
  const isPalette = 'isPaletteItem' in activeData || activeId.startsWith('palette-')

  const type =
    'type' in activeData
      ? activeData.type
      : activeId.startsWith('palette-')
        ? activeId.replace('palette-', '')
        : null

  const savedDesignId = 'savedDesignId' in activeData ? activeData.savedDesignId : undefined
  const ae = event.activatorEvent as PointerEvent | null

  const target = getDropTarget(
    pointer.x || ae?.clientX || 0,
    pointer.y || ae?.clientY || 0,
    useEditorStore.getState().nodes,
    registry,
    activeId,
    finalDwellId,
  )

  if (!target) {
    return
  }

  if (isPalette && savedDesignId) {
    insertSavedDesign(savedDesignId, target.targetId, target.position)
  } else if (isPalette && type) {
    addNode(type, target.targetId, target.position)
  } else {
    if (activeId !== target.targetId) {
      moveNode(activeId, target.targetId, target.position)
    }
  }
}
