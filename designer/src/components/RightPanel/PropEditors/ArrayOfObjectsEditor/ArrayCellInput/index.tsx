import { InputControl } from '@root/components/common/InputControl'
import type { ArrayItemField } from '@root/types/propSchema'

import styles from '../styles.module.scss'

export interface ArrayCellInputProps {
  field: ArrayItemField
  row: Record<string, unknown>
  rowIndex: number
  onChange: (rowIndex: number, fieldKey: string, value: unknown) => void
}

export const ArrayCellInput = ({
  field,
  row,
  rowIndex,
  onChange: handleFieldChange,
}: ArrayCellInputProps) => {
  const value = row[field.key]

  switch (field.type) {
    case 'boolean':
      return (
        <InputControl
          className={styles.arrayOfObjectsEditor__rowCheckbox}
          isChecked={Boolean(value)}
          type='checkbox'
          onChange={(event) => handleFieldChange(rowIndex, field.key, event.target.checked)}
        />
      )
    case 'number':
      return (
        <InputControl
          className={`${styles.arrayOfObjectsEditor__rowInput} ${styles['arrayOfObjectsEditor__rowInput--number']}`}
          type='number'
          value={value as number}
          onChange={(event) => handleFieldChange(rowIndex, field.key, Number(event.target.value))}
        />
      )

    default:
      return (
        <InputControl
          className={styles.arrayOfObjectsEditor__rowInput}
          placeholder={field.label}
          type='text'
          value={String(value ?? '')}
          onChange={(event) => handleFieldChange(rowIndex, field.key, event.target.value)}
        />
      )
  }
}
