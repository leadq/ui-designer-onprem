import { ButtonBase } from '@root/components/common/ButtonBase'
import { InputControl } from '@root/components/common/InputControl'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DataTableColumnConfig } from '@root/types/propSchema'

import styles from '../styles.module.scss'

export interface DataTableColumnsProps {
  safeColumns: DataTableColumnConfig[]
  onColumnChange: (
    index: number,
    field: keyof DataTableColumnConfig,
    value: string | number,
  ) => void
  onRemoveColumn: (index: number) => void
  onAddColumn: () => void
}

export const DataTableColumns = ({
  safeColumns,
  onColumnChange: handleColumnChange,
  onRemoveColumn: handleRemoveColumn,
  onAddColumn: handleAddColumnClick,
}: DataTableColumnsProps) => {
  const { translate } = useBuilderI18n()

  return (
    <div className={styles.dataTableEditor__section}>
      <div className={styles.dataTableEditor__sectionTitle}>
        <span className={styles.dataTableEditor__sectionTitleText}>
          {translate('dataTableEditor.columns')}
        </span>
        <ButtonBase
          className={styles.dataTableEditor__addBtn}
          type='button'
          onClick={handleAddColumnClick}
        >
          <span className={styles.dataTableEditor__addBtnIcon}>+</span>
          {translate('dataTableEditor.add')}
        </ButtonBase>
      </div>
      <table className={styles.dataTableEditor__table}>
        <thead>
          <tr>
            <th className={styles.dataTableEditor__th}>{translate('dataTableEditor.key')}</th>
            <th className={styles.dataTableEditor__th}>{translate('dataTableEditor.header')}</th>
            <th className={styles.dataTableEditor__th}>
              {translate('dataTableEditor.widthShort')}
            </th>
            <th
              className={`${styles.dataTableEditor__th} ${styles['dataTableEditor__th--actions']}`}
            />
          </tr>
        </thead>
        <tbody>
          {safeColumns.map((col, colIndex) => (
            <tr key={colIndex} className={styles.dataTableEditor__row}>
              <td className={styles.dataTableEditor__rowCell}>
                <InputControl
                  className={styles.dataTableEditor__rowInput}
                  type='text'
                  value={col.key}
                  onChange={(event) => handleColumnChange(colIndex, 'key', event.target.value)}
                />
              </td>
              <td className={styles.dataTableEditor__rowCell}>
                <InputControl
                  className={styles.dataTableEditor__rowInput}
                  type='text'
                  value={col.header}
                  onChange={(event) => handleColumnChange(colIndex, 'header', event.target.value)}
                />
              </td>
              <td className={styles.dataTableEditor__rowCell}>
                <InputControl
                  className={`${styles.dataTableEditor__rowInput} ${styles['dataTableEditor__rowInput--number']}`}
                  type='number'
                  value={col.width ?? ''}
                  onChange={(event) =>
                    handleColumnChange(colIndex, 'width', Number(event.target.value))
                  }
                />
              </td>
              <td className={styles.dataTableEditor__rowCell}>
                <EditorTooltip label={translate('dataTableEditor.removeColumn')}>
                  <ButtonBase
                    aria-label={translate('dataTableEditor.removeColumn')}
                    className={styles.dataTableEditor__rowDelete}
                    type='button'
                    onClick={() => handleRemoveColumn(colIndex)}
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
