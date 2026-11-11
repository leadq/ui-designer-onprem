import { ButtonBase } from '@root/components/common/ButtonBase'
import { InputControl } from '@root/components/common/InputControl'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DataTableColumnConfig } from '@root/types/propSchema'

import styles from '../styles.module.scss'

export interface DataTableRowsProps {
  safeColumns: DataTableColumnConfig[]
  safeData: Record<string, unknown>[]
  onCellChange: (row: number, key: string, value: string) => void
  onRemoveRow: (index: number) => void
  onAddRow: () => void
}

export const DataTableRows = ({
  safeColumns,
  safeData,
  onCellChange: handleCellChange,
  onRemoveRow: handleRemoveRow,
  onAddRow: handleAddRowClick,
}: DataTableRowsProps) => {
  const { translate } = useBuilderI18n()

  return (
    <div className={styles.dataTableEditor__section}>
      <div className={styles.dataTableEditor__sectionTitle}>
        <span className={styles.dataTableEditor__sectionTitleText}>
          {translate('dataTableEditor.data', { count: safeData.length })}
        </span>
        <ButtonBase
          className={styles.dataTableEditor__addBtn}
          type='button'
          onClick={handleAddRowClick}
        >
          <span className={styles.dataTableEditor__addBtnIcon}>+</span>
          {translate('dataTableEditor.add')}
        </ButtonBase>
      </div>
      <table className={styles.dataTableEditor__table}>
        <thead>
          <tr>
            {safeColumns.map((col) => (
              <th key={col.key} className={styles.dataTableEditor__th}>
                {col.header}
              </th>
            ))}
            <th
              className={`${styles.dataTableEditor__th} ${styles['dataTableEditor__th--actions']}`}
            />
          </tr>
        </thead>
        <tbody>
          {safeData.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.dataTableEditor__row}>
              {safeColumns.map((col) => (
                <td key={col.key} className={styles.dataTableEditor__rowCell}>
                  <InputControl
                    className={styles.dataTableEditor__rowInput}
                    type='text'
                    value={String(row[col.key] ?? '')}
                    onChange={(event) => handleCellChange(rowIndex, col.key, event.target.value)}
                  />
                </td>
              ))}
              <td className={styles.dataTableEditor__rowCell}>
                <EditorTooltip label={translate('dataTableEditor.removeRow')}>
                  <ButtonBase
                    aria-label={translate('dataTableEditor.removeRow')}
                    className={styles.dataTableEditor__rowDelete}
                    type='button'
                    onClick={() => handleRemoveRow(rowIndex)}
                  >
                    ✕
                  </ButtonBase>
                </EditorTooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
