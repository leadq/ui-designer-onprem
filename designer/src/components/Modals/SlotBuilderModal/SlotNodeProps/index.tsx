import { InputControl } from '@root/components/common/InputControl'
import { SelectControl } from '@root/components/common/SelectControl'
import { IconPropEditor } from '@root/components/RightPanel/IconPropEditor'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { ComponentMeta } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import styles from '../styles.module.scss'

export interface SlotNodePropsProps {
  selectedNode: DesignNode
  selectedMeta: ComponentMeta
  onChange: (key: string, value: unknown) => void
}

export const SlotNodeProps = ({
  selectedNode,
  selectedMeta,
  onChange: handlePropChange,
}: SlotNodePropsProps) => {
  const { translate } = useBuilderI18n()

  return (
    <div className={styles.slotBuilderModal__section}>
      <div className={styles.slotBuilderModal__sectionTitle}>
        {translate('slotBuilder.properties')}
      </div>
      {selectedMeta.propsSchema
        .filter(
          (schema) =>
            schema.type !== 'slot' &&
            schema.type !== 'arrayOfObjects' &&
            schema.type !== 'dataTable',
        )
        .map((schema) => {
          const value = selectedNode.props[schema.key] ?? schema.defaultValue

          return (
            <div key={schema.key} className={styles.slotBuilderModal__propField}>
              <span className={styles.slotBuilderModal__propFieldLabel}>{schema.label}</span>
              {schema.type === 'icon' && (
                <IconPropEditor
                  value={String(value ?? '')}
                  onChange={(next) => handlePropChange(schema.key, next)}
                />
              )}
              {schema.type === 'text' && (
                <InputControl
                  className={styles.slotBuilderModal__propFieldInput}
                  type='text'
                  value={String(value ?? '')}
                  onChange={(event) => handlePropChange(schema.key, event.target.value)}
                />
              )}
              {schema.type === 'number' && (
                <InputControl
                  className={styles.slotBuilderModal__propFieldInput}
                  max={schema.max}
                  min={schema.min}
                  type='number'
                  value={Number(value ?? 0)}
                  onChange={(event) =>
                    handlePropChange(
                      schema.key,
                      Math.min(
                        schema.max ?? Infinity,
                        Math.max(schema.min ?? -Infinity, Number(event.target.value)),
                      ),
                    )
                  }
                />
              )}
              {schema.type === 'boolean' && (
                <label className={styles.slotBuilderModal__propFieldCheckbox}>
                  <InputControl
                    isChecked={Boolean(value)}
                    type='checkbox'
                    onChange={(event) => handlePropChange(schema.key, event.target.checked)}
                  />
                  <span>{translate('slotBuilder.active')}</span>
                </label>
              )}
              {schema.type === 'select' && (
                <SelectControl
                  className={styles.slotBuilderModal__propFieldSelect}
                  value={String(value ?? '')}
                  onChange={(event) => handlePropChange(schema.key, event.target.value)}
                >
                  {schema.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </SelectControl>
              )}
              {schema.type === 'color' && (
                <InputControl
                  className={styles.slotBuilderModal__propFieldInput}
                  type='color'
                  value={String(value ?? '#ffffff')}
                  onChange={(event) => handlePropChange(schema.key, event.target.value)}
                />
              )}
            </div>
          )
        })}
    </div>
  )
}
