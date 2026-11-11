import { ButtonBase } from '@root/components/common/ButtonBase'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { ArrayItemField } from '@root/types/propSchema'
import { getDataRows } from '@root/utils/getDataRows'

import { getEmptyArrayItem } from './utils/getEmptyArrayItem'
import { ArrayCellInput } from './ArrayCellInput'

import styles from './styles.module.scss'

interface ArrayOfObjectsEditorProps {
  label: string
  items: Record<string, unknown>[]
  itemSchema: ArrayItemField[]
  onChange: (items: Record<string, unknown>[]) => void
}

const ArrayOfObjectsEditor = ({
  label,
  items,
  itemSchema,
  onChange,
}: ArrayOfObjectsEditorProps) => {
  const { translate } = useBuilderI18n()
  const safeItems = getDataRows(items)

  const handleFieldChange = (rowIndex: number, fieldKey: string, value: unknown) => {
    const updated = safeItems.map((item, index) =>
      index === rowIndex ? { ...item, [fieldKey]: value } : item,
    )

    onChange(updated)
  }

  const handleAddRow = () => {
    onChange([...safeItems, getEmptyArrayItem(itemSchema)])
  }

  const handleRemoveRow = (rowIndex: number) => {
    onChange(safeItems.filter((_, index) => index !== rowIndex))
  }

  const handleMoveRow = (rowIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1

    if (targetIndex < 0 || targetIndex >= safeItems.length) {
      return
    }

    const updated = [...safeItems]
    const temp = updated[rowIndex]

    updated[rowIndex] = updated[targetIndex]

    updated[targetIndex] = temp

    onChange(updated)
  }

  const handleAddRowClick = handleAddRow

  return (
    <div className={styles.arrayOfObjectsEditor}>
      <div className={styles.arrayOfObjectsEditor__header}>
        <span className={styles.arrayOfObjectsEditor__headerLabel}>{label}</span>
        <span className={styles.arrayOfObjectsEditor__headerCount}>{safeItems.length}</span>
      </div>

      {safeItems.length > 0 ? (
        <table className={styles.arrayOfObjectsEditor__table}>
          <thead className={styles.arrayOfObjectsEditor__thead}>
            <tr>
              {itemSchema.map((field) => (
                <th key={field.key} className={styles.arrayOfObjectsEditor__th}>
                  {field.label}
                </th>
              ))}
              <th
                className={`${styles.arrayOfObjectsEditor__th} ${styles['arrayOfObjectsEditor__th--actions']}`}
              />
            </tr>
          </thead>
          <tbody>
            {safeItems.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.arrayOfObjectsEditor__row}>
                {itemSchema.map((field) => (
                  <td key={field.key} className={styles.arrayOfObjectsEditor__rowCell}>
                    <ArrayCellInput
                      field={field}
                      row={row}
                      rowIndex={rowIndex}
                      onChange={handleFieldChange}
                    />
                  </td>
                ))}
                <td className={styles.arrayOfObjectsEditor__rowCell}>
                  <div className={styles.arrayOfObjectsEditor__rowActions}>
                    <EditorTooltip label={translate('array.moveUp')}>
                      <ButtonBase
                        aria-label={translate('array.moveUp')}
                        className={`${styles.arrayOfObjectsEditor__actionBtn} ${styles['arrayOfObjectsEditor__actionBtn--up']}`}
                        isDisabled={rowIndex === 0}
                        type='button'
                        onClick={() => handleMoveRow(rowIndex, 'up')}
                      >
                        ↑
                      </ButtonBase>
                    </EditorTooltip>
                    <EditorTooltip label={translate('array.moveDown')}>
                      <ButtonBase
                        aria-label={translate('array.moveDown')}
                        className={`${styles.arrayOfObjectsEditor__actionBtn} ${styles['arrayOfObjectsEditor__actionBtn--down']}`}
                        isDisabled={rowIndex === safeItems.length - 1}
                        type='button'
                        onClick={() => handleMoveRow(rowIndex, 'down')}
                      >
                        ↓
                      </ButtonBase>
                    </EditorTooltip>
                    <EditorTooltip label={translate('array.delete')}>
                      <ButtonBase
                        aria-label={translate('array.delete')}
                        className={`${styles.arrayOfObjectsEditor__actionBtn} ${styles['arrayOfObjectsEditor__actionBtn--delete']}`}
                        type='button'
                        onClick={() => handleRemoveRow(rowIndex)}
                      >
                        ✕
                      </ButtonBase>
                    </EditorTooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.arrayOfObjectsEditor__empty}>
          <div className={styles.arrayOfObjectsEditor__emptyText}>{translate('array.empty')}</div>
        </div>
      )}

      <ButtonBase
        className={styles.arrayOfObjectsEditor__addRow}
        type='button'
        onClick={handleAddRowClick}
      >
        <span className={styles.arrayOfObjectsEditor__addRowIcon}>+</span>
        {translate('array.add')}
      </ButtonBase>
    </div>
  )
}

export { ArrayOfObjectsEditor }

export type { ArrayOfObjectsEditorProps }
