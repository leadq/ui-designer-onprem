import { useEffect, useState } from 'react'
import { useEditorStore } from '@root/stores/editor'
import { findNode } from '@root/utils/nodes'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'

import type { TableTarget, TableTextDraft } from '../types'
import { getTableHit } from '../utils/getTableHit'

export const useTableEditing = () => {
  const [target, setTarget] = useState<TableTarget | null>(null)
  const [draft, setDraft] = useState<TableTextDraft | null>(null)
  const handleClose = () => setTarget(null)
  const handleCancel = () => setDraft(null)

  const handleSelectColumn = (hit: TableTarget) => {
    const column = getTableModel(hit.node).columns[hit.column]

    if (column) {
      useEditorStore.getState().setSelectedNodeIds([hit.node.id], undefined, column.key)
    }
  }

  const handleTarget = (hit: TableTarget | null) => {
    if (hit && hit.row === undefined) {
      handleSelectColumn(hit)
    }

    setTarget(hit)
  }

  const handleEdit = (hit: TableTarget) => {
    const { columns, cells } = getTableModel(hit.node)
    const cell = hit.row === undefined ? undefined : cells[hit.row * columns.length + hit.column]

    if (
      cell &&
      (cell.children.length > 1 ||
        (cell.children[0] &&
          (cell.children[0].type !== 'typography' || cell.children[0].children.length)))
    ) {
      useEditorStore.getState().setSelectedNodeIds([cell.id], cell.id)

      return
    }

    setDraft({
      tableId: hit.node.id,
      column: hit.column,
      cellId: cell?.id,
      text: cell ? String(cell.children[0]?.props.children ?? '') : columns[hit.column].header,
    })
  }

  const handleApply = (text: string) => {
    if (!draft) {
      return
    }

    useEditorStore
      .getState()
      .editTable(
        draft.tableId,
        draft.cellId
          ? { type: 'text', cellId: draft.cellId, text }
          : { type: 'header', column: draft.column, text },
      )

    setDraft(null)
  }

  useEffect(() => {
    const viewport = document.getElementById('canvas-wrapper')

    const handleEvent = (event: MouseEvent) => {
      if (
        !viewport?.contains(event.target as Node) ||
        (!(event.target as Element).closest('#render-layer') &&
          !(
            event.type === 'contextmenu' &&
            (event.target as Element).closest('[data-selection-node-id]')
          )) ||
        useEditorStore.getState().previewMode ||
        (event.target as Element).closest('[data-table-editor]')
      ) {
        return
      }

      const hit = getTableHit(useEditorStore.getState().nodes, event.clientX, event.clientY)

      if (!hit || event.ctrlKey || event.metaKey || event.shiftKey) {
        return
      }

      if (
        event.type === 'click' &&
        hit.row !== undefined &&
        useEditorStore.getState().focusedContainerId ===
          getTableModel(hit.node).cells[
            (hit.row ?? 0) * getTableModel(hit.node).columns.length + hit.column
          ]?.id
      ) {
        return
      }

      event.preventDefault()

      event.stopImmediatePropagation()

      const { columns, cells } = getTableModel(hit.node)
      const cell = hit.row === undefined ? undefined : cells[hit.row * columns.length + hit.column]

      if (hit.row === undefined) {
        handleSelectColumn(hit)
      } else {
        useEditorStore.getState().setSelectedNodeIds([cell?.id ?? hit.node.id], cell?.id)
      }

      if (event.type === 'contextmenu') {
        setTarget(hit)
      }

      if (event.type === 'dblclick') {
        handleEdit(hit)
      }
    }

    document.addEventListener('click', handleEvent, true)

    document.addEventListener('contextmenu', handleEvent, true)

    document.addEventListener('dblclick', handleEvent, true)

    return () => {
      document.removeEventListener('click', handleEvent, true)

      document.removeEventListener('contextmenu', handleEvent, true)

      document.removeEventListener('dblclick', handleEvent, true)
    }
  }, [])

  const liveTarget =
    target && findNode(useEditorStore.getState().nodes, target.node.id) ? target : null

  return {
    target: liveTarget,
    draft,
    handleClose,
    handleCancel,
    handleEdit,
    handleApply,
    handleTarget,
    handleSelectColumn,
  }
}
