import { ButtonBase } from '@root/components/common/ButtonBase'
import { InputControl } from '@root/components/common/InputControl'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DataTableColumnConfig } from '@root/types/propSchema'

import styles from '../styles.module.scss'

const DEFAULT_COLUMN_WIDTH = 120

export interface BuilderTableHeaderProps {
  localColumns: DataTableColumnConfig[]
  activeColIndex: number | null
  onActiveColumnChange: (index: number | null) => void
  onColumnSettingChange: (
    index: number,
    field: keyof DataTableColumnConfig,
    value: string | number,
  ) => void
  onRemoveColumn: (index: number) => void
}

export const BuilderTableHeader = ({
  localColumns,
  activeColIndex,
  onActiveColumnChange: handleActiveColumnChange,
  onColumnSettingChange: handleColumnSettingChange,
  onRemoveColumn: handleRemoveColumn,
}: BuilderTableHeaderProps) => {
  const { translate } = useBuilderI18n()

  return (
    <thead>
      <tr className={styles.dataTableBuilderModal__headerRow}>
        <th
          className={`${styles.dataTableBuilderModal__headerCell} ${styles['dataTableBuilderModal__headerCell--rowNum']}`}
        >
          #
        </th>
        {localColumns.map((col, colIndex) => (
          <th
            key={colIndex}
            className={styles.dataTableBuilderModal__headerCell}
            style={{ minWidth: col.width ?? DEFAULT_COLUMN_WIDTH }}
          >
            <div className={styles.dataTableBuilderModal__headerCellContent}>
              <span className={styles.dataTableBuilderModal__headerCellName}>{col.header}</span>
              <EditorTooltip label={translate('dataTableBuilder.columnSettings')}>
                <ButtonBase
                  aria-label={translate('dataTableBuilder.columnSettings')}
                  className={styles.dataTableBuilderModal__headerCellSettings}
                  type='button'
                  onClick={() =>
                    handleActiveColumnChange(activeColIndex === colIndex ? null : colIndex)
                  }
                >
                  ⚙
                </ButtonBase>
              </EditorTooltip>
              <EditorTooltip label={translate('dataTableBuilder.removeColumn')}>
                <ButtonBase
                  aria-label={translate('dataTableBuilder.removeColumn')}
                  className={styles.dataTableBuilderModal__headerCellDeleteCol}
                  type='button'
                  onClick={() => handleRemoveColumn(colIndex)}
                >
                  ✕
                </ButtonBase>
              </EditorTooltip>
            </div>

            {/* Column settings popover */}
            {activeColIndex === colIndex && (
              <div
                className={styles.dataTableBuilderModal__colSettings}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.dataTableBuilderModal__colSettingsField}>
                  <label className={styles.dataTableBuilderModal__colSettingsLabel}>
                    {translate('dataTableBuilder.key')}
                  </label>
                  <InputControl
                    className={styles.dataTableBuilderModal__colSettingsInput}
                    type='text'
                    value={col.key}
                    onChange={(event) =>
                      handleColumnSettingChange(colIndex, 'key', event.target.value)
                    }
                  />
                </div>
                <div className={styles.dataTableBuilderModal__colSettingsField}>
                  <label className={styles.dataTableBuilderModal__colSettingsLabel}>
                    {translate('dataTableBuilder.header')}
                  </label>
                  <InputControl
                    className={styles.dataTableBuilderModal__colSettingsInput}
                    type='text'
                    value={col.header}
                    onChange={(event) =>
                      handleColumnSettingChange(colIndex, 'header', event.target.value)
                    }
                  />
                </div>
                <div className={styles.dataTableBuilderModal__colSettingsField}>
                  <label className={styles.dataTableBuilderModal__colSettingsLabel}>
                    {translate('dataTableBuilder.width')}
                  </label>
                  <InputControl
                    className={styles.dataTableBuilderModal__colSettingsInput}
                    type='number'
                    value={col.width ?? ''}
                    onChange={(event) =>
                      handleColumnSettingChange(colIndex, 'width', Number(event.target.value))
                    }
                  />
                </div>
              </div>
            )}
          </th>
        ))}
        <th
          className={`${styles.dataTableBuilderModal__headerCell} ${styles['dataTableBuilderModal__headerCell--actions']}`}
        />
      </tr>
    </thead>
  )
}
