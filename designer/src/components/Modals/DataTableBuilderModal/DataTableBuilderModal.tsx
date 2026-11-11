import { Modal } from '@root/components/common'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DataTableColumnConfig } from '@root/types/propSchema'

import { useDataTableBuilder } from './hooks/useDataTableBuilder'
import { BuilderTableBody } from './BuilderTableBody'
import { BuilderTableHeader } from './BuilderTableHeader'

import styles from './styles.module.scss'

interface DataTableBuilderModalProps {
  isOpened: boolean
  columns: DataTableColumnConfig[]
  data: Record<string, unknown>[]
  onApply: (columns: DataTableColumnConfig[], data: Record<string, unknown>[]) => void
  onClose: () => void
}

const DataTableBuilderModal = ({
  isOpened,
  columns: initialColumns,
  data: initialData,
  onApply,
  onClose,
}: DataTableBuilderModalProps) => {
  const { translate } = useBuilderI18n()

  const {
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
  } = useDataTableBuilder(isOpened, initialColumns, initialData, onApply, onClose)

  return (
    <Modal
      isOpen={isOpened}
      size='xl'
      title={translate('dataTableBuilder.title')}
      onClose={onClose}
    >
      <div className={styles.dataTableBuilderModal__content}>
        {/* Toolbar */}
        <div className={styles.dataTableBuilderModal__toolbar}>
          <div className={styles.dataTableBuilderModal__toolbarLeft}>
            <ButtonBase
              className={styles.dataTableBuilderModal__btn}
              type='button'
              onClick={handleAddColumnClick}
            >
              <span className={styles.dataTableBuilderModal__btnIcon}>+</span>
              {translate('dataTableBuilder.addColumn')}
            </ButtonBase>
            <ButtonBase
              className={styles.dataTableBuilderModal__btn}
              type='button'
              onClick={handleAddRowClick}
            >
              <span className={styles.dataTableBuilderModal__btnIcon}>+</span>
              {translate('dataTableBuilder.addRow')}
            </ButtonBase>
            <span className={styles.dataTableBuilderModal__toolbarBadge}>
              {translate('dataTableBuilder.summary', {
                columns: localColumns.length,
                rows: localData.length,
              })}
            </span>
          </div>
          <div className={styles.dataTableBuilderModal__toolbarRight}>
            <ButtonBase
              className={styles.dataTableBuilderModal__btn}
              type='button'
              onClick={handleCancelClick}
            >
              {translate('dataTableBuilder.cancel')}
            </ButtonBase>
            <ButtonBase
              className={`${styles.dataTableBuilderModal__btn} ${styles['dataTableBuilderModal__btn--primary']}`}
              type='button'
              onClick={handleApplyClick}
            >
              {translate('dataTableBuilder.apply')}
            </ButtonBase>
          </div>
        </div>

        {/* Spreadsheet-like table */}
        <div className={styles.dataTableBuilderModal__tableWrapper}>
          <table className={styles.dataTableBuilderModal__table}>
            <BuilderTableHeader
              activeColIndex={activeColIndex}
              localColumns={localColumns}
              onActiveColumnChange={handleActiveColumnChange}
              onColumnSettingChange={handleColumnSettingChange}
              onRemoveColumn={handleRemoveColumn}
            />
            <BuilderTableBody
              localColumns={localColumns}
              localData={localData}
              onCellChange={handleCellChange}
              onRemoveRow={handleRemoveRow}
            />
          </table>
        </div>

        {/* Footer */}
        <div className={styles.dataTableBuilderModal__footer}>
          <ButtonBase
            className={styles.dataTableBuilderModal__btn}
            type='button'
            onClick={handleCancelClick}
          >
            {translate('dataTableBuilder.cancel')}
          </ButtonBase>
          <ButtonBase
            className={`${styles.dataTableBuilderModal__btn} ${styles['dataTableBuilderModal__btn--primary']}`}
            type='button'
            onClick={handleApplyClick}
          >
            {translate('dataTableBuilder.apply')}
          </ButtonBase>
        </div>
      </div>
    </Modal>
  )
}

export { DataTableBuilderModal }

export type { DataTableBuilderModalProps }
