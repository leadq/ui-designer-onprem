import { useState } from 'react'
import type { DataTableColumnConfig } from '@root/types/propSchema'

export const useDataTableBuilder = (
  isOpened: boolean,
  initialColumns: DataTableColumnConfig[],
  initialData: Record<string, unknown>[],
  onApply: (columns: DataTableColumnConfig[], data: Record<string, unknown>[]) => void,
  onClose: () => void,
) => {
  const [localColumns, setLocalColumns] = useState<DataTableColumnConfig[]>(initialColumns)
  const [localData, setLocalData] = useState<Record<string, unknown>[]>(initialData)
  const [activeColIndex, setActiveColIndex] = useState<number | null>(null)

  // Sync when modal opens
  const handleOpen = () => {
    setLocalColumns([...initialColumns.map((column) => ({ ...column }))])

    setLocalData([...initialData.map((row) => ({ ...row }))])

    setActiveColIndex(null)
  }

  if (isOpened && localColumns.length === 0 && initialColumns.length > 0) {
    handleOpen()
  }

  const handleAddColumn = () => {
    const newKey = `col_${localColumns.length + 1}`

    const newCol: DataTableColumnConfig = {
      key: newKey,
      header: `Column ${localColumns.length + 1}`,
      width: 150,
    }

    setLocalColumns([...localColumns, newCol])

    setLocalData(localData.map((row) => ({ ...row, [newKey]: '' })))
  }

  const handleRemoveColumn = (colIndex: number) => {
    const removedKey = localColumns[colIndex].key

    setLocalColumns(localColumns.filter((_, index) => index !== colIndex))

    setLocalData(
      localData.map((row) => {
        const newRow = { ...row }

        delete newRow[removedKey]

        return newRow
      }),
    )

    if (activeColIndex === colIndex) {
      setActiveColIndex(null)
    }
  }

  const handleColumnSettingChange = (
    colIndex: number,
    field: keyof DataTableColumnConfig,
    value: string | number,
  ) => {
    const updated = localColumns.map((col, index) => {
      if (index !== colIndex) {
        return col
      }

      return { ...col, [field]: value }
    })

    if (field === 'key') {
      const oldKey = localColumns[colIndex].key

      setLocalData(
        localData.map((row) => {
          const newRow = { ...row }

          newRow[value as string] = newRow[oldKey]

          delete newRow[oldKey]

          return newRow
        }),
      )
    }

    setLocalColumns(updated)
  }

  const handleAddRow = () => {
    const newRow: Record<string, unknown> = {}

    for (const col of localColumns) {
      newRow[col.key] = ''
    }

    setLocalData([...localData, newRow])
  }

  const handleRemoveRow = (rowIndex: number) => {
    setLocalData(localData.filter((_, index) => index !== rowIndex))
  }

  const handleCellChange = (rowIndex: number, colKey: string, value: string) => {
    setLocalData(
      localData.map((row, index) => (index === rowIndex ? { ...row, [colKey]: value } : row)),
    )
  }

  const handleApply = () => {
    onApply(localColumns, localData)
  }

  const handleCancel = () => {
    onClose()
  }

  const handleAddColumnClick = handleAddColumn
  const handleAddRowClick = handleAddRow
  const handleCancelClick = handleCancel
  const handleApplyClick = handleApply
  const handleActiveColumnChange = setActiveColIndex

  return {
    localColumns,
    localData,
    activeColIndex,
    handleRemoveColumn,
    handleColumnSettingChange,
    handleRemoveRow,
    handleCellChange,
    handleAddColumnClick,
    handleAddRowClick,
    handleCancelClick,
    handleApplyClick,
    handleActiveColumnChange,
  }
}
