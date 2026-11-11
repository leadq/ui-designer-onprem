import { ButtonBase } from '@root/components/common/ButtonBase'
import { InputControl } from '@root/components/common/InputControl'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DataTableColumnConfig } from '@root/types/propSchema'

import styles from '../styles.module.scss'

export interface BuilderTableBodyProps {
  localColumns: DataTableColumnConfig[]
  localData: Record<string, unknown>[]
  onCellChange: (row: number, key: string, value: string) => void
  onRemoveRow: (row: number) => void
}

export const BuilderTableBody = ({
  localColumns,
  localData,
  onCellChange: handleCellChange,
  onRemoveRow: handleRemoveRow,
}: BuilderTableBodyProps) => {
  const { translate } = useBuilderI18n()

  return (
    <tbody>
      {localData.map((row, rowIndex) => (
        <tr key={rowIndex} className={styles.dataTableBuilderModal__bodyRow}>
          <td
            className={`${styles.dataTableBuilderModal__bodyCell} ${styles['dataTableBuilderModal__bodyCell--rowNum']}`}
          >
            {rowIndex + 1}
          </td>
          {localColumns.map((col) => (
            <td key={col.key} className={styles.dataTableBuilderModal__bodyCell}>
              <InputControl
                className={styles.dataTableBuilderModal__cellInput}
                type='text'
                value={String(row[col.key] ?? '')}
                onChange={(event) => handleCellChange(rowIndex, col.key, event.target.value)}
              />
            </td>
          ))}
          <td
            className={`${styles.dataTableBuilderModal__bodyCell} ${styles['dataTableBuilderModal__bodyCell--actions']}`}
          >
            <EditorTooltip label={translate('dataTableBuilder.deleteRow')}>
              <ButtonBase
                aria-label={translate('dataTableBuilder.deleteRow')}
                className={styles.dataTableBuilderModal__deleteRowBtn}
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
  )
}
