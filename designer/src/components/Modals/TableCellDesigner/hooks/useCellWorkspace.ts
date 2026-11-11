import { type DragEvent, type MouseEvent, useMemo, useState } from 'react'
import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { validateComponentContract } from '@root/utils/designer/componentContract'
import { cloneNodesForReuse, findNode } from '@root/utils/nodes'
import { getMaterializedTableCell } from '@root/utils/tableAuthoring/getMaterializedTableCell'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'
import { getWorkspace } from '@root/utils/workspacePersistence/state'

import { useCellDraft } from './useCellDraft'

export const useCellWorkspace = (tableId: string, cell: DesignNode, onClose: () => void) => {
  const session = useMemo(() => {
    const state = useEditorStore.getState()

    return {
      expected: JSON.parse(JSON.stringify(cell)) as DesignNode,
      adapterId: state.adapterId,
      designId: getWorkspace().active.id,
      initial: getMaterializedTableCell(
        JSON.parse(JSON.stringify(cell)),
        registry,
        state.slotComponents,
      ),
      width: state.canvasWidth ?? BREAKPOINT_MAP.xl,
      breakpoint: state.activeBreakpoint,
    }
  }, [cell])

  const draft = useCellDraft(session.initial, session.breakpoint)
  const [error, setError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isOver, setIsOver] = useState(false)
  const saved = useEditorStore((state) => state.slotComponents)

  const handleFinish = () => {
    const state = useEditorStore.getState()
    const table = findNode(state.nodes, tableId)
    const current = table && getTableModel(table).cells.find((item) => item.id === cell.id)

    if (
      state.adapterId !== session.adapterId ||
      getWorkspace().active.id !== session.designId ||
      !current ||
      JSON.stringify(current) !== JSON.stringify(session.expected)
    ) {
      setError(true)

      return
    }

    if (JSON.stringify(draft.root) === JSON.stringify(session.initial)) {
      onClose()

      return
    }

    try {
      state.editTable(tableId, { type: 'cell', expected: session.expected, value: draft.root })

      onClose()
    } catch {
      setError(true)
    }
  }

  const handleSave = () => {
    try {
      validateComponentContract([draft.root], registry)

      setIsSaving(true)
    } catch {
      setError(true)
    }
  }

  const getTarget = (target: EventTarget) =>
    target instanceof Element
      ? target.closest<HTMLElement>('[data-cell-node]')?.dataset.cellNode
      : undefined

  const handleSelect = (event: MouseEvent) => {
    if ((event.target as Element).closest('[data-canvas-control]')) {
      return
    }

    event.preventDefault()

    event.stopPropagation()

    draft.handleSelect(getTarget(event.target) ?? draft.root.id)
  }

  const handleDragStart = (event: DragEvent) => {
    const movingId = getTarget(event.target)

    if (!movingId) {
      return
    }

    event.stopPropagation()

    event.dataTransfer.setData('application/x-cell-designer', JSON.stringify({ movingId }))
  }

  const handleSaved = (id: string, target = draft.selected.id) => {
    const item = saved.find((entry) => entry.id === id)

    if (item) {
      draft.handleInsert(
        target,
        cloneNodesForReuse(
          item.nodes.map((node) => getMaterializedTableCell(node, registry, saved)),
        ),
      )
    }
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()

    event.stopPropagation()

    setIsOver(false)

    try {
      const value = JSON.parse(event.dataTransfer.getData('application/x-cell-designer')) as {
        type?: string
        movingId?: string
        savedId?: string
      }

      const target = getTarget(event.target) ?? draft.root.id

      if (value.savedId) {
        handleSaved(value.savedId, target)
      } else if (
        value.movingId ||
        (value.type &&
          registry[value.type] &&
          !registry[value.type].overlay &&
          !registry[value.type].collectionItem &&
          !value.type.startsWith('designer'))
      ) {
        draft.handleDrop(target, value.type, value.movingId)
      }
    } catch {
      /* External drags do not enter this isolated draft. */
    }
  }

  return {
    ...draft,
    session,
    error,
    isSaving,
    isOver,
    saved,
    handleFinish,
    handleSave,
    handleSaveClose: () => setIsSaving(false),
    handleCanvasSelect: handleSelect,
    handleDragStart,
    handleDrop,
    handleAdd: (type: string) => draft.handleDrop(draft.selected.id, type),
    handleSaved,
    handleDragOver: (event: DragEvent) => {
      event.preventDefault()

      setIsOver(true)
    },
    handleDragLeave: () => setIsOver(false),
  }
}
