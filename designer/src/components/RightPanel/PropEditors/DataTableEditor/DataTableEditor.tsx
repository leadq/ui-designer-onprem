import { ButtonBase } from '@root/components/common/ButtonBase'
import { DataTableBuilderModal } from '@root/components/Modals/DataTableBuilderModal/DataTableBuilderModal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DataTableColumnConfig } from '@root/types/propSchema'

import { useDataTableEditor } from './hooks/useDataTableEditor'
import { DataTableColumns } from './DataTableColumns'
import { DataTableRows } from './DataTableRows'

import styles from './styles.module.scss'

interface DataTableEditorProps {
  columns: DataTableColumnConfig[]
  data: Record<string, unknown>[]
  onChange: (columns: DataTableColumnConfig[], data: Record<string, unknown>[]) => void
}

const DataTableEditor = ({ columns, data, onChange }: DataTableEditorProps) => {
  const { translate } = useBuilderI18n()

  const {
    isBuilderOpen,
    setIsBuilderOpen,
    safeColumns,
    safeData,
    handleColumnChange,
    handleRemoveColumn,
    handleCellChange,
    handleRemoveRow,
    handleBuilderApply,
    handleAddColumnClick: handleAddColumn,
    handleAddRowClick: handleAddRow,
  } = useDataTableEditor(columns, data, onChange)

  return (
    <div className={styles.dataTableEditor}>
      <div className={styles.dataTableEditor__header}>
        <span className={styles.dataTableEditor__headerLabel}>
          <span className={styles.dataTableEditor__headerIcon}>📊</span>
          {translate('dataTableEditor.title')}
        </span>
        <span className={styles.dataTableEditor__headerBadge}>
          {safeColumns.length}×{safeData.length}
        </span>
      </div>

      {/* Columns section */}
      <DataTableColumns
        safeColumns={safeColumns}
        onAddColumn={handleAddColumn}
        onColumnChange={handleColumnChange}
        onRemoveColumn={handleRemoveColumn}
      />

      {/* Sample Data section */}
      <DataTableRows
        safeColumns={safeColumns}
        safeData={safeData}
        onAddRow={handleAddRow}
        onCellChange={handleCellChange}
        onRemoveRow={handleRemoveRow}
      />

      {/* Open Builder button */}
      <ButtonBase
        className={styles.dataTableEditor__openBuilder}
        type='button'
        onClick={() => setIsBuilderOpen(true)}
      >
        <span className={styles.dataTableEditor__openBuilderIcon}>⚙️</span>
        {translate('dataTableEditor.open')}
      </ButtonBase>

      <DataTableBuilderModal
        columns={safeColumns}
        data={safeData}
        isOpened={isBuilderOpen}
        onApply={handleBuilderApply}
        onClose={() => setIsBuilderOpen(false)}
      />
    </div>
  )
}

export { DataTableEditor }

export type { DataTableEditorProps }
