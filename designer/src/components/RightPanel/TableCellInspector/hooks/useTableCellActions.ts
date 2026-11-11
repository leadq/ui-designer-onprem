import { useState } from 'react'
import type { TableTextDraft } from '@root/components/Canvas/TableEditingLayer/types'
import { getTableCellContext } from '@root/components/RightPanel/utils/getTableCellContext'
import { useEditorStore } from '@root/stores/editor'

export const useTableCellActions = (nodeId: string) => {
  const nodes = useEditorStore((state) => state.nodes)
  const context = getTableCellContext(nodes, nodeId)
  const [draft, setDraft] = useState<TableTextDraft | null>(null)
  const cell = context?.cell

  const canEditText = Boolean(
    cell &&
    (cell.children.length === 0 ||
      (cell.children.length === 1 &&
        cell.children[0].type === 'typography' &&
        cell.children[0].children.length === 0)),
  )

  const handleEditClick = () => {
    if (!context || !canEditText) {
      return
    }

    setDraft({
      tableId: context.table.id,
      column: context.column,
      cellId: context.cell.id,
      text: String(context.cell.children[0]?.props.children ?? ''),
    })
  }

  const handleCancel = () => setDraft(null)

  const handleApply = (text: string) => {
    if (draft?.cellId) {
      useEditorStore
        .getState()
        .editTable(draft.tableId, { type: 'text', cellId: draft.cellId, text })
    }

    setDraft(null)
  }

  const handleCopyColumnClick = () => {
    if (context) {
      useEditorStore.getState().editTable(context.table.id, {
        type: 'copy',
        row: context.row,
        column: context.column,
        axis: 'column',
      })
    }
  }

  const handleCopyRowClick = () => {
    if (context) {
      useEditorStore.getState().editTable(context.table.id, {
        type: 'copy',
        row: context.row,
        column: context.column,
        axis: 'row',
      })
    }
  }

  return {
    context,
    canEditText,
    draft,
    handleEditClick,
    handleCancel,
    handleApply,
    handleCopyColumnClick,
    handleCopyRowClick,
  }
}
