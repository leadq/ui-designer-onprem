import { forwardRef } from 'react'
import { useStableId } from '@root/hooks/useStableId'

import { InfoPopover } from '../InfoPopover'
import { SelectControl, type SelectControlProps } from '../SelectControl'
import { Text } from '../Text'

import styles from './styles.module.scss'

interface SelectProps extends SelectControlProps {
  isCompact?: boolean
  label?: string
  help?: { title: string; description: string }
  data: (string | { value: string; label: string; disabled?: boolean })[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, help, data, isCompact: compact = false, className = '', id, ...props }, ref) => {
    const generatedId = useStableId()
    const selectId = id ?? generatedId

    return (
      <div
        className={[
          styles.select,
          compact ? styles['select--compact'] : '',
          label ? styles['select--floating'] : '',
          help ? styles['select--withHelp'] : '',
          className,
        ].join(' ')}
      >
        <div className={styles.select__wrapper}>
          <SelectControl ref={ref} className={styles.select__field} id={selectId} {...props}>
            {data.map((item) => {
              const value = typeof item === 'string' ? item : item.value
              const label = typeof item === 'string' ? item : item.label

              return (
                <option
                  key={value}
                  disabled={typeof item !== 'string' && item.disabled}
                  value={value}
                >
                  {label}
                </option>
              )
            })}
          </SelectControl>
          {label ? (
            <label className={styles.select__label} htmlFor={selectId}>
              {label}
            </label>
          ) : null}
          <span aria-hidden='true' className={styles.select__icon}>
            ▼
          </span>
        </div>
        {help ? (
          <InfoPopover icon='help' label={help.title}>
            <Text color='muted' size='sm'>
              {help.description}
            </Text>
          </InfoPopover>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
