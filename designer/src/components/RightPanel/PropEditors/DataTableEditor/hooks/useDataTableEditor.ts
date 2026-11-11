import { useState } from 'react'
import type { DataTableColumnConfig } from '@root/types/propSchema'
import { getDataRows } from '@root/utils/getDataRows'

export const useDataTableEditor = (
  columns: DataTableColumnConfig[],
  data: Record<string, unknown>[],
  onChange: (columns: DataTableColumnConfig[], data: Record<string, unknown>[]) => void,
) => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const safeColumns = Array.isArray(columns) ? columns : []
  const safeData = getDataRows(data)

  const handleColumnChange = (
    colIndex: number,
    field: keyof DataTableColumnConfig,
    value: string | number,
  ) => {
    const updated = safeColumns.map((col, index) =>
      index === colIndex ? { ...col, [field]: value } : col,
    )

    // If key changed, update all data rows too
    if (field === 'key') {
      const oldKey = safeColumns[colIndex].key

      const updatedData = safeData.map((row) => {
        const newRow = { ...row }

        newRow[value as string] = newRow[oldKey]

        delete newRow[oldKey]

        return newRow
      })

      onChange(updated, updatedData)
    } else {
      onChange(updated, safeData)
    }
  }

  const handleAddColumn = () => {
    const newKey = `col_${safeColumns.length + 1}`

    const newCol: DataTableColumnConfig = {
      key: newKey,
      header: `Column ${safeColumns.length + 1}`,
      width: 150,
    }

    const updatedData = safeData.map((row) => ({
      ...row,
      [newKey]: '',
    }))

    onChange([...safeColumns, newCol], updatedData)
  }

  const handleRemoveColumn = (colIndex: number) => {
    const removedKey = safeColumns[colIndex].key
    const updatedCols = safeColumns.filter((_, index) => index !== colIndex)

    const updatedData = safeData.map((row) => {
      const newRow = { ...row }

      delete newRow[removedKey]

      return newRow
    })

    onChange(updatedCols, updatedData)
  }

  const handleCellChange = (rowIndex: number, colKey: string, value: string) => {
    const updatedData = safeData.map((row, index) =>
      index === rowIndex ? { ...row, [colKey]: value } : row,
    )

    onChange(safeColumns, updatedData)
  }

  const handleAddRow = () => {
    const newRow: Record<string, unknown> = {}

    for (const col of safeColumns) {
      newRow[col.key] = ''
    }

    onChange(safeColumns, [...safeData, newRow])
  }

  const handleRemoveRow = (rowIndex: number) => {
    onChange(
      safeColumns,
      safeData.filter((_, index) => index !== rowIndex),
    )
  }

  const handleBuilderApply = (
    newColumns: DataTableColumnConfig[],
    newData: Record<string, unknown>[],
  ) => {
    onChange(newColumns, newData)

    setIsBuilderOpen(false)
  }

  const handleAddColumnClick = handleAddColumn
  const handleAddRowClick = handleAddRow

  return {
    isBuilderOpen,
    setIsBuilderOpen,
    safeColumns,
    safeData,
    handleColumnChange,
    handleRemoveColumn,
    handleCellChange,
    handleRemoveRow,
    handleBuilderApply,
    handleAddColumnClick,
    handleAddRowClick,
  }
}
