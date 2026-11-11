import { useState } from 'react'
import { Button, Disclosure, Group, Select, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import type { ComponentStateRule } from '@root/types/preview'

import { ConditionEditor } from '../ConditionEditor'
import { getInitialStateCondition } from '../utils/getInitialStateCondition'

export interface StateRuleEditorProps {
  value: ComponentStateRule
  fields: DesignNode[]
  onChange: (value: ComponentStateRule) => void
}

export const StateRuleEditor = ({ value, fields, onChange }: StateRuleEditorProps) => {
  const { translate } = useBuilderI18n()

  const [editingIndex, setEditingIndex] = useState<number | null>(
    value.conditions.length === 1 ? 0 : null,
  )

  const getSummary = (condition: ComponentStateRule['conditions'][number]) => {
    const field = fields.find((item) => item.id === condition.source.nodeId)

    const name =
      field?.label ??
      String(
        field?.props.label ??
          (field && registry[field.type]?.displayName) ??
          condition.source.nodeId,
      )

    const comparison =
      typeof condition.value === 'boolean'
        ? translate(condition.value ? 'condition.true' : 'condition.false')
        : condition.value

    return `${name} · ${translate(`condition.operator.${condition.operator}`)}${comparison === null || comparison === undefined || ['empty', 'notEmpty'].includes(condition.operator) ? '' : `: ${comparison}`}${condition.operator === 'between' ? ` – ${condition.upperValue}` : ''}`
  }

  return (
    <Stack gap='md'>
      <Select
        label={translate('componentState.match')}
        value={value.match}
        data={(['all', 'any'] as const).map((match) => ({
          value: match,
          label: translate(`componentState.${match}`),
        }))}
        onChange={(event) => onChange({ ...value, match: event.target.value as 'all' | 'any' })}
      />
      {value.conditions.map((condition, index) => (
        <Disclosure
          key={index}
          isOpen={editingIndex === index}
          label={getSummary(condition)}
          onToggle={(isOpen) =>
            setEditingIndex((current) => (isOpen ? index : current === index ? null : current))
          }
        >
          <Stack gap='sm'>
            <Group justify='between'>
              <Text size='sm' weight={600}>
                {translate('componentState.condition', { count: index + 1 })}
              </Text>
              <Button
                isDisabled={value.conditions.length === 1}
                size='sm'
                variant='ghost'
                onClick={() => {
                  setEditingIndex(null)

                  onChange({
                    ...value,
                    conditions: value.conditions.filter((_, position) => position !== index),
                  })
                }}
              >
                {translate('interaction.remove')}
              </Button>
            </Group>
            <ConditionEditor
              isFieldsOnly
              nodes={fields}
              value={condition}
              onChange={(next) => {
                if (next.source.kind !== 'field') {
                  return
                }

                const conditions = [...value.conditions]

                conditions[index] = { ...next, source: next.source }

                onChange({ ...value, conditions })
              }}
            />
          </Stack>
        </Disclosure>
      ))}
      <Button
        isDisabled={!fields.length}
        variant='secondary'
        onClick={() => {
          setEditingIndex(value.conditions.length)

          onChange({
            ...value,
            conditions: [...value.conditions, getInitialStateCondition(fields[0])],
          })
        }}
      >
        {translate('componentState.addCondition')}
      </Button>
    </Stack>
  )
}
